use midly::{Format, Header, Smf, Timing};
use serde::{ser::SerializeStruct};
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
struct MidiData(Smf<'static>);

impl serde::Serialize for MidiData {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut s = serializer.serialize_struct("data", 2)?;
        s.serialize_field("header", &MidiHeader::from(self.0.header))?;
        // s.serialize_field("tracks", &self.0.tracks)?;
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
        .emit(
            "midi-file-processed",
            MidiData(smf.make_static()),
        )
        .unwrap()
}
