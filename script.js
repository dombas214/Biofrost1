const products = {
 bread: {title:"ХЛЕБ",items:[["Чиабатта",18],["Хлебец с ядром подсолнуха",18],["Хлеб «Солодовый»",18],["Хлеб «Луковый»",18],["Хлеб «Балтийский»",30],["Багет «Сельский»",20],["Багет «Французский»",18]]},
 sweet: {title:"СЛАДКАЯ ВЫПЕЧКА",items:[["Круассан с вишней",30],["Круассан с шоколадом",30],["Круассан с ванилью",30],["Круассан «Микс»",30],["Круассан ореховый",35],["Ролл Нью-Йорк с вишней",35],["Ролл Нью-Йорк с шоколадом",35],["Ролл Нью-Йорк с фисташкой",35],["Бомболони с ванилью",25],["Бомболони с шоколадом",25],["Эклер шоколадный",25],["Эклер ванильный",25],["Чизкейк",30],["Медовик",40],["Наполеон",40],["Штрудель с яблоком",25],["Рулетик с яблоком и орехом",25],["Меренговый рулет",35],["Донатс",20],["Пирожное Шу",28],["Тарт вишнёвый",25],["Профитроль",13],["Крендель",20],["Ушко",25],["Пирожное безе",15],["Меренги",15],["Синнабон",35],["Печенье овсяное",35]]},
 savory: {title:"НЕСЛАДКАЯ ВЫПЕЧКА",items:[["Пицца «4 сыра»",30],["Пицца «Верона»",25],["Пицца «Пепперони»",25],["Сэндвич с карбонатом",40],["Сэндвич с салями",40],["Чиабатта с курицей",40],["Пирог Сибирский",25],["Пирог Осетинский",35],["Сосиска в тесте",30],["Слойка с курицей",28],["Киш с курицей и грибами",40],["Треугольник с вишней",30],["Треугольник с картошкой",20],["Треугольник с творогом",25],["Треугольник с тыквой",20],["Треугольник с картошкой и мясом",25]]},
 vertuty: {title:"ВЕРТУТЫ",items:[["С картошкой",25],["С капустой",25],["С тыквой",25],["С картошкой и грибами",25],["С капустой и грибами",25],["С курицей и грибами",25],["С творогом",30]]},
 frozen: {title:"ЗАМОРОЖЕННАЯ ПРОДУКЦИЯ",items:[["Багет сельский · 2 шт.",38],["Хлеб балтийский · 1 шт.",35],["Сосиска в тесте · 2 шт.",45],["Синнабон · 2 шт.",35],["Булочки для мини-бургеров · 4 шт.",30],["Круассан классический","Цена не указана"]]}
};
const menuPhotos = {
  bread: ["photo-1509440159596-0249088772ff", "photo-1585478259715-876acc5be8eb", "photo-1608198093002-ad4e005484e3"],
  sweet: ["photo-1555507036-ab1f4038808a", "photo-1578985545062-69928b1d9587", "photo-1488477181946-6428a0291777", "photo-1509365465985-25d11c17e812", "photo-1486427944299-d1955d23e34d"],
  savory: ["photo-1513104890138-7c749659a591", "photo-1579751626657-72bc17010498", "photo-1603133872878-684f208fb84b", "photo-1608198093002-ad4e005484e3"],
  vertuty: ["photo-1509440159596-0249088772ff", "photo-1608198093002-ad4e005484e3", "photo-1509365465985-25d11c17e812"],
  frozen: ["photo-1555507036-ab1f4038808a", "photo-1509440159596-0249088772ff", "photo-1608198093002-ad4e005484e3"]
};
const list=document.querySelector("#menu-list"), caption=document.querySelector("#category-caption");
function renderMenu(key){
  const group=products[key], photos=menuPhotos[key]||menuPhotos.bread;
  caption.textContent=group.title;
  list.innerHTML=group.items.map(([name,price],index)=>{
    const image=`https://images.unsplash.com/${photos[index%photos.length]}?auto=format&fit=crop&w=180&h=150&q=80`;
    return `<article class="menu-item"><img class="menu-item-photo" src="${image}" alt="${name}" loading="lazy"><span>${name}</span><b>${typeof price==="number"?price+" руб.":price}</b></article>`;
  }).join("");
  document.querySelectorAll(".tab").forEach(t=>{const active=t.dataset.category===key;t.classList.toggle("active",active);t.setAttribute("aria-selected",active?"true":"false")});
}
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>renderMenu(tab.dataset.category)));
renderMenu("bread");
const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open))});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false")}));
document.querySelector("#order-form").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const msg = document.querySelector("#form-message");
  const data = Object.fromEntries(new FormData(form).entries());
  msg.textContent = "Отправляем заявку…";
  msg.classList.remove("success", "error");
  button.disabled = true;
  try {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.message || "Не удалось отправить заявку.");
    msg.textContent = result.message;
    msg.classList.add("success");
    form.reset();
  } catch (error) {
    msg.textContent = error.message || "Ошибка отправки. Попробуйте ещё раз.";
    msg.classList.add("error");
  } finally {
    button.disabled = false;
  }
});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".section,.product-card").forEach(el=>{el.classList.add("reveal");observer.observe(el)});
