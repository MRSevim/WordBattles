export const Rules = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Nasıl Oynanır?</h1>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Her oyuncu 100 harflik havuzdan rastgele 7 harf çeker ve A'ya en
            yakın harfi alan oyuncu oyuna başlar. Boş harf A'dan önceliklidir.
            Yakınlık aynıysa rastgele bir oyuncu seçilir.
          </li>
          <li>
            İlk oyuncu, ilk sırada, merkezdeki hücreyi kullanarak, elindeki
            harflerle, soldan sağa veya yukarıdan aşağıya olacak şekilde anlamlı
            bir (TDK sözlüğünde olan, kelimeler
            https://sozluk.gov.tr/gts?ara="kelime" urlsinden kelime yerine
            aranan kelime yazılarak çekilmektedir) kelime türetir. (Harfleri
            hücrelere yerleştirir ve gönder butonuna basar). Yerleştirilen
            harfler yatay veya dikey hizalanmış olmak zorundadır. Hem yatay, hem
            dikey hizalananlar geçersizdir. Tek harflik kelimeler, TDK
            sözlüğünde bulunsa bile sayılmaz. Doğru oyunu yaptıktan, harf
            değiştirdikten, sırasını geçtikten veya süresi bittikten sonra sıra
            diğer oyuncuya geçer. Süre bitiminde tahtadaki harfler otomatik
            olarak oynanmış olur.
          </li>
          <li>
            Doğru kelimeler türetirse oyuncular puan alır (bkz. Puan hesaplama)
            ve harf havuzundan harf/harfler çekerek elindeki harfleri yediye
            tamamlar.
          </li>
          <li>
            Diğer oyuncu da yine aynı şekilde kelime türetmeye çalışır. Dolu
            olan hücrelere harf yerleştiremez. Kelimeler, dolu olan hücrelerin
            en az biri ile yatay veya dikey olarak bağlantılı şekilde türetilmiş
            olmalıdır. İkinci oyuncudan devam edecek şekilde oyuncular, her
            turda, birden fazla kelime türetebilir. Çapraz, bağlantısız veya
            hizalanmamış kelimeler kabul edilmez.
          </li>
          <li>
            Oyun devam eden durumlarda sonlanır: 1.Havuzdaki tüm harfler
            çekilince ve bir oyuncu elindeki harfleri bitirince 2.Dört defa
            üstüste pas geçilince 3.Bir oyuncu 2 tur boyuncu oyunu kapatınca
            4.Bir oyuncu oyundan ayrılınca
          </li>
        </ul>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-4">Puan Hesaplama</h1>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Oyuncular türettikleri kelimenin/kelimelerin harflerinin puanları
            toplamı kadar puan alır. (bkz. Harf Havuzu)
          </li>
          <li>
            Bonus hücrelere yerleştirilerek türetilen harfler/kelimeler fazladan
            puan verir. Çifte Harfe (H2) yerleştirilen harf puanını iki katına
            çıkarırken üçlüye (H3) yerleştirilen harf üç katına çıkarır. Çifte
            kelimeye (K2) yerleştirilerek türetilen kelime puanını iki katına
            çıkarırken üçlüye yerleştirilen türetilen üçlü kelime (K3) üç katına
            çıkarır. Bonuslarda önce harf bonusu hesaplanır ve sonra kelime
            bonusu o hesapla çarpılır. Eğer bir bonus harf hücresi iki veya daha
            fazla kelime türetiyorsa bonus bütün kelimelere uygulanır. Kelime
            bonusu kullanılarak birden fazla kelime türetiliyorsa da bonus,
            üstünden geçen bütün kelimelere uygulanır. Bir kelime birden fazla
            kelime bonusundan geçiyorsa çarpanlar üst üste çarpılır. Boş harfler
            puan sağlamaz ancak boş harf, kelime bonusuna yerleştirilerek kelime
            türetilmişse bile, kelime bonus puanı kazanılır. Merkez hücre çifte
            kelime bonusu sağlar.
          </li>
          <li>
            Eğer oyuncu elindeki tüm 7 harfi, bir sırada başarılı bir şekilde
            kullanırsa bu Bingo olur ve oyuncu puanı hesaplandıktan sonra ekstra
            50 puan kazanır.
          </li>
          <li>
            Eğer tüm harfler çekilmiş ve bir oyuncu elindeki harfleri bitirmiş
            ise, elindeki harfleri bitiren oyuncu, diğer oyuncunun elindeki harf
            sayısı kadar puan kazanır. Diğer oyuncu elindeki harf sayısı kadar
            puan kaybeder.
          </li>
          <li>
            Oyun bitiminde, iki oyuncu arasındaki puan farkı, her oyuncunun
            dereceli puanına eklenir. Örnek: Oyun 30 puan farkıyla bitmişse,
            kazanan oyuncu +30 dereceli puanı alırken, kaybeden -30 alır. Derece
            puanı ekleme ve çıkarmaları, 2 oyuncu da giriş yaptıysa yapılır.
          </li>
          <li>
            Oyun bitmeden bir oyuncu ayrılırsa (oyundan çıkar veya iki tur
            boyunca oyunu kapatırsa), ayrılan oyuncu geride ise ayrılmadan
            önceki puan farkı, oyuncuların dereceli puanlarına eklenir. Diğer
            durumda dereceli puan değişimleri uygulanmaz.
          </li>
        </ul>
      </div>
      <div>
        <LetterTable />
      </div>
    </div>
  );
};
const LetterTable = () => {
  const letters = [
    { letter: "", point: 0, amount: 2 },
    { letter: "A", point: 1, amount: 12 },
    { letter: "B", point: 3, amount: 2 },
    { letter: "C", point: 4, amount: 2 },
    { letter: "Ç", point: 4, amount: 2 },
    { letter: "D", point: 3, amount: 2 },
    { letter: "E", point: 1, amount: 8 },
    { letter: "F", point: 8, amount: 1 },
    { letter: "G", point: 5, amount: 1 },
    { letter: "Ğ", point: 7, amount: 1 },
    { letter: "H", point: 5, amount: 1 },
    { letter: "I", point: 2, amount: 4 },
    { letter: "İ", point: 1, amount: 7 },
    { letter: "J", point: 10, amount: 1 },
    { letter: "K", point: 1, amount: 7 },
    { letter: "L", point: 1, amount: 7 },
    { letter: "M", point: 2, amount: 4 },
    { letter: "N", point: 1, amount: 5 },
    { letter: "O", point: 2, amount: 3 },
    { letter: "Ö", point: 6, amount: 1 },
    { letter: "P", point: 7, amount: 1 },
    { letter: "R", point: 2, amount: 6 },
    { letter: "S", point: 3, amount: 3 },
    { letter: "Ş", point: 4, amount: 2 },
    { letter: "T", point: 2, amount: 5 },
    { letter: "U", point: 2, amount: 3 },
    { letter: "Ü", point: 3, amount: 2 },
    { letter: "V", point: 7, amount: 1 },
    { letter: "Y", point: 3, amount: 2 },
    { letter: "Z", point: 4, amount: 2 },
  ];
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Harf Havuzu</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-4 border-b">Harf</th>
            <th className="py-2 px-4 border-b">Puan</th>
            <th className="py-2 px-4 border-b">Miktar</th>
          </tr>
        </thead>
        <tbody>
          {letters.map((letter, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-center">
                {letter.letter || "Boş"}
              </td>
              <td className="py-2 px-4 border-b text-center">{letter.point}</td>
              <td className="py-2 px-4 border-b text-center">
                {letter.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
