use midly::{Format, Header, Smf, Timing, TrackEvent, TrackEventKind};
use serde::ser::{SerializeSeq, SerializeStruct, SerializeStructVariant};
use std::{fs, path::Path};
use tauri::Window;

#[derive(Clone)]
struct HeaderFormat(Format);

impl serde::Serialize for HeaderFormat {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(match self.0 {
            Format::SingleTrack => "SingleTrack",
            Format::Parallel => "Parallel",
            Format::Sequential => "Sequential",
        })
    }
}

impl From<Format> for HeaderFormat {
    fn from(f: Format) -> Self {
        HeaderFormat(f)
    }
}

#[derive(Clone)]
struct HeaderTiming(Timing);

impl From<Timing> for HeaderTiming {
    fn from(t: Timing) -> Self {
        HeaderTiming(t)
    }
}

impl serde::Serialize for HeaderTiming {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match self.0 {
            Timing::Metrical(x) => serializer.serialize_u16(x.as_int()),
            Timing::Timecode(fps, subframe) => {
                let mut timecode = serializer.serialize_struct("timecode", 2)?;
                timecode.serialize_field("fps", &fps.as_f32())?;
                timecode.serialize_field("subframe", &subframe)?;
                timecode.end()
            }
        }
    }
}

#[derive(Clone)]
struct MidiHeader(Header);

impl From<Header> for MidiHeader {
    fn from(t: Header) -> Self {
        MidiHeader(t)
    }
}

impl serde::Serialize for MidiHeader {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut header = serializer.serialize_struct("header", 2)?;
        header.serialize_field("format", &HeaderFormat::from(self.0.format))?;
        header.serialize_field("timing", &HeaderTiming::from(self.0.timing))?;
        header.end()
    }
}

#[derive(Clone)]
struct MidiTrackEventKind(TrackEventKind<'static>);

impl From<TrackEventKind<'static>> for MidiTrackEventKind {
    fn from(t: TrackEventKind) -> Self {
        MidiTrackEventKind(t)
    }
}

impl serde::Serialize for MidiTrackEventKind {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match self.0 {
            TrackEventKind::Midi { channel, message } => {
                let mut midi =
                    serializer.serialize_struct_variant("track_event_kind", 0, "midi", 2)?;
                midi.serialize_field("channel", &channel.as_int())?;
                // midi.serialize_field("message", &message)?;

                midi.end()

                // let mut timecode = serializer.serialize_struct("timecode", 2)?;
                // timecode.serialize_field("fps", &fps.as_f32())?;
                // timecode.serialize_field("subframe", &subframe)?;
                // timecode.end()
            }
            TrackEventKind::SysEx(a) => {
                let mut seq = serializer.serialize_seq(Some(a.len()))?;
                for e in a {
                    seq.serialize_element(e)?;
                }
                seq.end()
            }
            TrackEventKind::Escape(a) => {
                let mut seq = serializer.serialize_seq(Some(a.len()))?;
                for e in a {
                    seq.serialize_element(e)?;
                }
                seq.end()
            }
            TrackEventKind::Meta(meta_message) => {
                let mut meta = serializer.serialize_struct_variant("track_event_kind", 3, "meta");

                meta.end()
            }
            _ => todo!(),
        }
    }
}

#[derive(Clone)]
struct MidiTrackEvent(TrackEvent<'static>);

impl From<TrackEvent<'static>> for MidiTrackEvent {
    fn from(t: TrackEvent) -> Self {
        MidiTrackEvent(t)
    }
}

impl serde::Serialize for MidiTrackEvent {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut track_event = serializer.serialize_struct("track_event", 2)?;
        track_event.serialize_field("delta", &self.0.delta.as_int())?;
        track_event.serialize_field("kind", &MidiTrackEventKind::from(self.0.kind))?;
        track_event.end()
    }
}

#[derive(Clone)]
struct MidiData(Smf<'static>);

impl serde::Serialize for MidiData {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut s = serializer.serialize_struct("data", 2)?;
        s.serialize_field("header", &MidiHeader::from(self.0.header))?;

        let tracks = &self
            .0
            .tracks
            .iter()
            .map(|&track| {
                track
                    .iter()
                    .map(|&track_event| MidiTrackEvent::from(track_event))
            })
            .collect();

        s.serialize_field("tracks", tracks)?;

        // let mut tracks_seq = serializer.serialize_seq(Some(self.0.tracks.len()))?;
        // for track_events in self.0.tracks {
        //     let mut track_events_seq = tracks_seq.serialize_seq(Some(track_events.len()))?;
        //     for track_event in track_events {
        //         let mut track = track_events_seq.serialize_struct("track_event", 2)?;
        //         track.serialize_field("delta", &track_event.delta.as_int())?;
        //         // state.serialize_field("kind", &track_event.kind)?;
        //     }
        // }

        // s.serialize_field("tracks", track)

        s.end()
    }
}

pub fn process_midi(window: &Window, file_path: &Path) {
    // Load bytes into a buffer
    let data = fs::read(file_path).unwrap();
    // Parse raw bytes
    let smf = Smf::parse(&data).unwrap();

    println!("Finished processing file: {}", file_path.display());

    window
        .emit("midi-file-processed", MidiData(smf.make_static()))
        .unwrap()
}
