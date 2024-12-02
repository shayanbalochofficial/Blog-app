import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client"; // your sanity client import

const builder = imageUrlBuilder(client);

export function urlForImage(source: { asset: { _ref: string } }) {
  return builder.image(source).url(); // Ensure `.url()` returns the string URL
}
