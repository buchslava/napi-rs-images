#![deny(clippy::all)]

use image::{GenericImageView, ImageBuffer, Pixel};

use napi_derive::napi;

#[napi]
pub fn darker(filename: String, saturation: u8) {
  let img = image::open(filename.clone()).expect("File not found!");
  let (w, h) = img.dimensions();
  let mut output = ImageBuffer::new(w, h);

  for (x, y, pixel) in img.pixels() {
    output.put_pixel(x, y, pixel.map(|p| p.saturating_sub(saturation)));
  }

  output.save(filename).unwrap();
}
