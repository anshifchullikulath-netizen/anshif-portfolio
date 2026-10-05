
const nav=document.getElementById('nav'), menu=document.getElementById('menu');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>50));
menu.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
