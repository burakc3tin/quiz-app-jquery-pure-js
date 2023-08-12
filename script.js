let suankiSoruIndeksi = 0;
let skor = 0;
let sorular = [];
let simdikiSoruNumarasi = 1;

const sonucKutusu = document.getElementById('sonuc-alani');
const soruno = document.getElementById('soruno');
const soruKutusuArkaPlanRengi = document.getElementById('soru-alani');

function sorulariYukle() {
    $.ajax({
        url: 'https://opentdb.com/api.php?amount=5',
        method: 'GET',
        dataType: 'json',
        success: function(veri) {
            sorular = veri.results.map(soru => {
                const cozulmusSoru = $('<div/>').html(soru.question).text();
                const cozulmusSecenekler = soru.incorrect_answers.map(secenek => $('<div/>').html(secenek).text());
                const cozulmusDogruCevap = $('<div/>').html(soru.correct_answer).text();
        
                return {
                    ...soru,
                    question: cozulmusSoru,
                    incorrect_answers: cozulmusSecenekler,
                    correct_answer: cozulmusDogruCevap,
                    answeredCorrectly: false  

                };
            });
        
            sorulariGoster();
        }
    });
}

function sorulariGoster() {
    const suankiSoru = sorular[suankiSoruIndeksi];
    const soruItem = document.getElementById('soru');
    const siklar = document.getElementById('siklar');
 
    soruItem.innerText = suankiSoru.question;
    siklar.innerHTML = '';
    
    const secimler = [...suankiSoru.incorrect_answers, suankiSoru.correct_answer];
    secimler.sort(() => Math.random() - 0.5);
    
    secimler.forEach(secim => {
        const li = document.createElement('button');
        li.innerText = secim;
        li.style.margin='5px';
        li.style.padding='10px';
        li.style.cursor='pointer';
        li.style.width='400px';
        li.style.borderRadius='10px';
        li.style.border='1px solid white';
        li.addEventListener('mouseenter', () => {
            li.style.backgroundColor = '#FFF';
            li.style.color='#EE6744';
        });
        li.addEventListener('mouseleave', () => {
            li.style.backgroundColor = '#EE6744';
            li.style.color='#FFF';
        });
        li.addEventListener('click', () => {
            dogruCevap(secim);
            simdikiSoruNumarasi++;
            soruno.innerText = simdikiSoruNumarasi;
        });
        siklar.appendChild(li);
        const br = document.createElement('br');
        siklar.appendChild(br);
    });
}

function dogruCevap(secilenYanit) {
    const suankiSoru = sorular[suankiSoruIndeksi];
    const dogruYanit = suankiSoru.correct_answer; 
    
    if (secilenYanit === dogruYanit) {
 
        if (!suankiSoru.answeredCorrectly) {
             suankiSoru.answeredCorrectly = true;
 
            arkaPlanYesilIsik();
   skor += 5  
        }
    } else {
        arkaPlanKirmiziIsik();
    }

    suankiSoruIndeksi++;
    if (suankiSoruIndeksi < sorular.length) {
        sorulariGoster();
    } else {
        sonuclariGoster();
    }
}

function arkaPlanYesilIsik() {
    soruKutusuArkaPlanRengi.style.backgroundColor = 'green';
    setTimeout(() => {
        soruKutusuArkaPlanRengi.style.backgroundColor = '';
    }, 500);  
}

function arkaPlanKirmiziIsik() {
    soruKutusuArkaPlanRengi.style.backgroundColor = 'red';
    setTimeout(() => {
        soruKutusuArkaPlanRengi.style.backgroundColor = '';
    }, 500);  
}


function sonuclariGoster() {
    const soruAlani = document.getElementById('soru-alani');
    const puanItem = document.getElementById('puan');
    const oncekiPuanItem = document.getElementById('onceki-puan');
    const oncekiPuanYazi = document.getElementById('onceki-puan-yazi');

   
    localStorage.setItem('yarismaSkor', skor.toString());

    soruAlani.style.display = 'none';
    
    sonucKutusu.style.display = 'block';
    puanItem.innerText = skor;
    

    let kaydedilenPuan = localStorage.getItem('yarismaSkor');
    if (kaydedilenPuan !== null) {
        const kaydedilenPuanInt = parseInt(kaydedilenPuan);
        oncekiPuanItem.innerText = kaydedilenPuanInt;
    }
     const puanYazi = document.getElementById('puan-yazi');
     puanYazi.style.display='block'
    oncekiPuanYazi.style.display="none"

    
}

function oyunuSifirla() {
    localStorage.removeItem('yarismaSkor');
  
    suankiSoruIndeksi = 0;
    skor = 0;
    sorular = [];
    sorulariYukle();

    const soruAlani = document.getElementById('soru-alani');
    const puanItem = document.getElementById('puan');
    const oncekiPuanItem = document.getElementById('onceki-puan');

    soruAlani.style.display = 'block';
    sonucKutusu.style.display = 'none';
    puanItem.innerText = '';
    oncekiPuanItem.innerText = '';
}

$(document).ready(function() {
    sorulariYukle();
   
      const sonrakiSoru = document.getElementById('sonraki-soru');
    
     soruno.innerText = simdikiSoruNumarasi;

     sonrakiSoru.addEventListener('click', () => {
        
       
        if (suankiSoruIndeksi < sorular.length - 1) {
            suankiSoruIndeksi++;
            simdikiSoruNumarasi++; // Soru numarasını bir arttır
            soruno.innerText = simdikiSoruNumarasi; // Soru numarasını güncelle
            sorulariGoster();
          
        } else {
            sonuclariGoster();
        }


     
    });
   
    let kaydedilenPuan = localStorage.getItem('yarismaSkor');
    if (kaydedilenPuan !== null) {
        const kaydedilenPuanInt = parseInt(kaydedilenPuan);
        const puanItem = document.getElementById('puan');
        puanItem.innerText = kaydedilenPuanInt;
      
        const oncekiPuanItem = document.getElementById('onceki-puan');
        oncekiPuanItem.innerText = kaydedilenPuanInt;

        sonucKutusu.style.display = 'block';
    }
});
