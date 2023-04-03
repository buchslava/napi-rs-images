#![deny(clippy::all)]

use image::{GenericImageView, ImageBuffer, Pixel};

use napi_derive::napi;

#[napi]
pub fn plus_100(input: u32) -> u32 {
  input + 100
}

#[napi]
pub fn darker() {
  let img = image::open("/Users/slava/Desktop/test.png").expect("File not found!");
  let (w, h) = img.dimensions();
  let mut output = ImageBuffer::new(w, h);

  for (x, y, pixel) in img.pixels() {
    output.put_pixel(x, y, pixel.map(|p| p.saturating_sub(65)));
  }

  output.save("/Users/slava/Desktop/output.png").unwrap();
}
