import { illustrationMap } from '../../assets/illustrations/index.js';

export default function ProductArt({ product, color = 'currentColor', detailed = false }) {
  const Illustration = illustrationMap[product.illustration] || illustrationMap.tote;
  return <Illustration color={color} detailed={detailed} />;
}
