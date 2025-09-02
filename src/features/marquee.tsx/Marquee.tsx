type Props = { text?: string };
export default function Marquee({ text = 'Live feed placeholder' }: Props) {
  return <section className="section" style={{ background:'transparent' }}>{text}</section>;
}