import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import type { Lang } from '../content'
import { interviewRecords } from '../interviews'
import { usePageMeta } from '../lib/seo'
import { foldSearchText } from '../textUtils'

const copy = {
 tr: {title:'Söyleşiler', intro:'Şahin Alpay’ın sorularıyla başlayan ve onun hayatını, yazılarını, düşünsel dönüşümünü konu alan konuşmalar. Yazılı söyleşiler, kitaplar, radyo ve televizyon programları kronolojik olarak bir arada.', by:'Şahin Alpay’ın yaptığı söyleşiler', with:'Şahin Alpay ile yapılan söyleşiler', search:'Kişi, program veya yayın ara', sort:'Sıralama', oldest:'Eskiden yeniye', newest:'Yeniden eskiye', only:'Yalnız doğrudan erişilebilir kayıtlar', empty:'Bu seçimle eşleşen kayıt yok.', reset:'Seçimleri temizle', count:'kayıt', legend:'Erişim durumu', open:'Doğrudan erişilebilir', bibliographic:'Bibliyografik / program kaydı', reference:'İkincil atıf', legendText:'Kaynak bağlantıları metne, kayda veya belirtilen program/kitap sayfasına gider. Bibliyografik kayıtlar tam metnin açık olduğu anlamına gelmez. Kesin tarihi bulunmayan söyleşiler dönem veya kitap basım yılıyla gösterilir; dizi kayıtları ayrı bölümleri temsil etmez. Bağlantısız kayıtlar önceki çalışma bibliyografyasından aktarılmıştır ve burada yeniden doğrulanmamıştır.', person:'Kişi / program', outlet:'Yayın', kind:'Tür', status:'Erişim', sources:'Kaynaklar', text:'Yazılı söyleşi', radio:'Radyo / podcast', video:'TV / video', book:'Kitap söyleşisi', notes:'Arşiv notu', noteText:'Cumhuriyet, Milliyet ve Sabah’ın kapalı arşivleri ana listeye alınmadı. Şerif Mardin ve Sabri Ülgener ile 1980’lerin başındaki Cumhuriyet söyleşilerinin varlığı, İştar Gözaydın’ın 2025 tarihli K24 söyleşisinde Alpay’ın anlatımıyla anılıyor. Bu atıf, asıl söyleşilere açık erişim sağlamıyor.', related:'Söyleşi dışındaki kayıtlar', relatedText:'Üçüncü Göz (3 Mayıs 1999 – Nisan 2003), Şahin Alpay’ın yorum programıdır; program arşivi aşağıdadır. Çalışma listesindeki 4 Kasım 2002 seçim değerlendirmesi ile mevcut arşivdeki 6 Şubat 2026 Ahmet Turan Alkan anma videosu söyleşi niteliğinde olmadığı için ana listeye dahil edilmedi.'},
 en: {title:'Interviews', intro:'Conversations led by Şahin Alpay, and interviews exploring his life, writing and changing ideas. Written interviews, books, radio and television programmes appear chronologically. Source material remains in its original language.', by:'Interviews conducted by Şahin Alpay', with:'Interviews with Şahin Alpay', search:'Search a person, programme or publication', sort:'Order', oldest:'Oldest first', newest:'Newest first', only:'Only directly accessible records', empty:'No records match this selection.', reset:'Clear selection', count:'records', legend:'Access status', open:'Directly accessible', bibliographic:'Bibliographic / programme record', reference:'Secondary reference', legendText:'Source links lead to the text, recording or named programme/book page. Bibliographic records do not imply open full-text access. Uncertain dates are shown as periods or publication years; series records do not represent individual episodes. Records without links come from the supplied working bibliography and have not been independently reverified here.', person:'Person / programme', outlet:'Publication', kind:'Format', status:'Access', sources:'Sources', text:'Written interview', radio:'Radio / podcast', video:'TV / video', book:'Book interview', notes:'Archive note', noteText:'Closed Cumhuriyet, Milliyet and Sabah archives are excluded from the main list. Alpay recalls his early-1980s Cumhuriyet interviews with Şerif Mardin and Sabri Ülgener in İştar Gözaydın’s 2025 K24 interview. This reference does not provide access to the originals.', related:'Other recordings', relatedText:'Üçüncü Göz (3 May 1999 – April 2003) was Alpay’s commentary programme; its archive is linked below. The 4 November 2002 election commentary and the existing 6 February 2026 Ahmet Turan Alkan tribute video are excluded from the interview list because they are not interviews.'},
}
export function InterviewsPage({lang}: {lang: Lang}) {
 const t=copy[lang]
 const location=useLocation()
 const [params,setParams]=useSearchParams()
 const query=params.get('q') ?? ''
 const [newest,setNewest]=useState(false)
 usePageMeta({title:`${t.title} — Şahin Alpay`, description:'', canonicalPath:location.pathname, robots:'noindex, nofollow'})
 const filtered=interviewRecords.filter(item=>foldSearchText([item.title,item.person,item.outlet,item.date].join(' ')).includes(foldSearchText(query)))
 const records=newest ? [...filtered].reverse() : filtered
 return <section className="section section-solo interview-page"><div className="container">
  <h1 className="section-title">{t.title}</h1>
  <nav className="interview-jumps" aria-label={t.title}><a href="#conducted">{t.by}</a><a href="#received">{t.with}</a></nav>

  <div className="interview-controls">
   <label className="interview-search">{t.search}<input type="search" value={query} onChange={event=>{const next=new URLSearchParams(params); if(event.target.value) next.set('q',event.target.value); else next.delete('q'); setParams(next,{replace:true})}} /></label>
   <label>{t.sort}<select className="sort-select" value={newest?'newest':'oldest'} onChange={event=>setNewest(event.target.value==='newest')}><option value="oldest">{t.oldest}</option><option value="newest">{t.newest}</option></select></label>

  </div><p className="interview-result-count" role="status">{records.length} {t.count}</p>
  {(['by','with'] as const).map(group=>{const items=records.filter(item=>item.group===group); return <section className="interview-group" id={group==='by'?'conducted':'received'} key={group} aria-labelledby={`heading-${group}`}>
   <h2 id={`heading-${group}`}>{t[group]}</h2>
   {items.length ? <ol className="archive-list">{items.map(item=><li key={item.id}><article className="archive-row archive-row-static">
    <div className="archive-row-meta"><span className="archive-row-date">{item.date}</span></div><div className="archive-row-body"><h3 className="archive-row-title">{item.title}</h3>
    <dl className="interview-facts"><div><dt>{t.person}</dt><dd>{item.person}</dd></div><div><dt>{t.outlet}</dt><dd>{item.outlet}</dd></div><div><dt>{t.kind}</dt><dd>{t[item.kind]}</dd></div></dl>
    {item.note && <p className="interview-note">{item.note[lang]}</p>}
    {item.links.length>0 && <ul className="interview-links" aria-label={t.sources}>{item.links.map(source=><li key={source.url}><a href={source.url.startsWith('/') && lang==='en'?'/books':source.url} {...(source.url.startsWith('https:')?{target:'_blank',rel:'noopener noreferrer'}:{})}>{source.label}</a></li>)}</ul>}
    </div></article></li>)}</ol> : <p>{t.empty}</p>}
  </section>})}
  {!records.length && <button className="btn btn-primary" onClick={()=>{setParams(new URLSearchParams())}}>{t.reset}</button>}
  <aside className="interview-archive-note"><h2>{t.notes}</h2><p>{t.noteText}</p><a href="https://www.k24kitap.org/sahin-alpayla-soylesi-liberal-demokratlikta-israrciyim-5386" target="_blank" rel="noopener noreferrer">K24 — İştar Gözaydın</a><h3>{t.related}</h3><p>{t.relatedText}</p><a href="https://apacikradyo.com.tr/program/ucuncu-goz" target="_blank" rel="noopener noreferrer">Üçüncü Göz — Apaçık Radyo</a><br /><a href="https://www.youtube.com/watch?v=UGrAaipn1DQ" target="_blank" rel="noopener noreferrer">KHK TV — Ahmet Turan Alkan</a></aside>
 </div></section>
}
