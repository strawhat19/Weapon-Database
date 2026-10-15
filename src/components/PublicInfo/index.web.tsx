import Head from 'expo-router/head';
import { Link, router } from 'expo-router';
import Header from '../Header';
import Footer from '../Footer';
import { information, type InfoPage } from './content';
const PublicInfo = ({ page }: { page: InfoPage }) => {
  const content = information[page];
  return <div id={`public-${page}`}><Head><title>{content.title} | Weapon Database</title><meta name={`description`} content={content.description} /></Head><Header onOpenAccount={() => router.push(`/signin`)} onOpenInfo={topic => router.push(`/${topic}`)} /><main id={`${page}-main`} className={`container`} style={{ paddingBlock: 48, minHeight: `55vh` }}><h1>{content.title}</h1><p style={{ marginBlock: 20 }}>{content.description}</p>{content.paragraphs.map((paragraph, index) => <p id={`${page}-paragraph-${index}`} key={paragraph} style={{ maxWidth: 850, marginBlock: 20, lineHeight: 1.8 }}>{paragraph}</p>)}{page === `contact` && <><label htmlFor={`contact-message`}>Message (delivery unavailable)</label><textarea id={`contact-message`} disabled /><button disabled>Send message (not connected)</button></>}<nav aria-label={`Information pages`} style={{ display: `flex`, gap: 20, flexWrap: `wrap` }}>{Object.entries(information).map(([key, value]) => <Link key={key} href={`/${key}` as never}>{value.title}</Link>)}<Link href={`/saved`}>Saved entries</Link></nav></main><Footer onOpenInfo={topic => router.push(`/${topic}`)} /></div>;
};
export default PublicInfo;
