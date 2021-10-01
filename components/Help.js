import { useSelector } from 'react-redux';

export default function Help() {
  const article = useSelector(({ article }) => article.fragment);
  return <iframe src={`/qboho/${article}`} className="basbolt-help" />
}