import React from "react";
import "./Law.css";
import { useDispatch, useSelector } from "react-redux";
import { updateLaw } from "../../redux/webSlice";

const Law = () => {
  //! Initializations
  const dispatch = useDispatch();
  const { law } = useSelector((state) => ({ ...state.web }));
  return (
    <section
      id="law"
      className={law?.TOS || law?.PRIVACY ? "openLaw" : undefined}
      onClick={() => dispatch(updateLaw({ TOS: false, PRIVACY: false }))}
    >
      <article>
        {law?.TOS ? (
          <>
            <h2>კონფიდენციალურობის პოლიტიკა</h2>
            <p>
              ჩვენი ერთ-ერთი მთავარი პრიორიტეტი არის ჩვენი მომხმარებლების
              კონფიდენციალურობა. ეს დოკუმენტი შეიცავს ინფორმაციას ჩვენი
              კონფიდენციალურობის პოლიტიკის შესახებ, თუ რა სახის იმფორმაცია
              გროვდება konogima.com -ს მიერ, და როგორ ვიყენებთ მას. თუ თქვენ
              გაქვთ დამატებითი შეკითხვები ან გჭირდებათ მეტი ინფორმაცია ჩვენი
              კონფიდენციალურობის პოლიტიკის შესახებ, შეგიძლიათ დაგვეკონტაქტოთ
              მეილზე. ეს პოლიტიკა ვრცელდება მხოლოდ ჩვენი ვებ გვერდის აქტივობებზე
              და იყენებს მომხმარებლის იმ იმფორმაციას რომელიც მათ გაუზიარეს
              konogima.com-ს.
            </p>
            <h2>თანხმობა</h2>
            <p>
              ჩვენი ვევგვერდის გამოყენებისას თქვენ ავტომატურად ეთანხმებით ჩვენს
              კომფედენცოალობის პოლიტიკას და მის პირობებს. ინფორმაცია რომელსაც
              ვაგროვებთ : მიზეზი რის გამოც ჩვენ გთხოვთ თქვენი პირადი იმფორმაციის
              გაზიარებას, განმარტებული იქნება იმ მომენტში როდესაც თქვენ
              მოგეთხოვებათ სხვადასხვა სახის პერსონალური ინფორმაციის შეყვანა.
              როდესაც შექმნით konogima.com -ს ანგარიშს, ჩვენგან მოგეთხოვებათ
              ისეთი სახის იმფორმაციის მოწოდება როგორებიცაა:ელფოსტა, პაროლი,
              სახელი. რისთვის ვიყენებთ თქვენს შესახებ ინფორმაციას: ჩვენ ვიყენებთ
              თქვენს შესახებ სხვადასხვა სახით მიღებულ ინფორმაციას იმისათვის რომ:
            </p>
            <ol>
              <li>ვუზრუნველყოთ ჩვენი საიტის გამართულად მუშაობა.</li>
              <li>გავაუმჯობესოთ ჩვენი ვებ საიტი.</li>
              <li>შევქმნათ ახალი პროდუქტები, და განახლებული ფუნქციონალი.</li>
              <li>
                მოვახდინოთ თქვენთან კომუნიკაცია სხვადასხვა მიზნებით, მოგაწოდოთ
                ინფორმაცია განახლებების შესახებ
              </li>
              <li>თავიდან აგარიდოთ თაღლითობა</li>
              <li>
                მივიღოთ თქვენი შეფასება, ანიმეს ან რაიმე პროდუქტთან დაკავშირებით
              </li>
            </ol>
            <p>
              ამასთანავე აღსანიშნავია ისიც, რომ მომხმარებლის პაროლი მონაცემთა
              ბაზაში შენახვამდე იშიფრება და konogima.com, მომხმარებლის რეალური
              პაროლის შესახებ ინფორმაციას არ ფლობს.
            </p>
            <h2>COOKIES</h2>
            <p>
              სხვა საიტების მზგავსად konogima.com იყენებს “ქუქიებს”, ოღონც
              მხოლოდ სერვერის შიდა ქუქის, რაც იმას ნიშნავს, რომ ეს ქუქი თქვენ
              აქტივობას საიტზე არ ინახავს, მხოლოდ მომხმარებლის დაშიფრულ
              საიდენთიფიკაციო კოდს, რომელიც გამოიყენება მომხმარებლის მონაცემთა
              დასაბრუნბლად საიტზე, ავტორიზაციის დროს.
            </p>
            <h2>მარეგულირებელი კანონი</h2>
            <p>
              პერსონალური მონაცემების კონფიდენციალობის პოლიტიკა რეგულირდება
              საქართველოს კანონმდებლობით, კერძოდ, პერსონალურ მონაცემთა დაცვის
              შესახებ საქართველოს კანონით, რომელიც არეგულირებს პერსონალურ
              მონაცემთა დამუშავების პროცესს. პერსონალურ მონაცემთა დაცვის შესახებ
              საქართველოს კანონით გარანტირებულია, რომ პერსონალურ მონაცემთა
              დამუშავება მოხდება ინდივიდის ფუნდამენტური უფლებებისა და
              თავისუფლებების შესაბამისად.
            </p>
            <h2>შესწორებები და ცვლილებები</h2>
            <p>
              konogima.com- ს შეუძლია შეცვალოს ან უბრალოდ განაახლოს
              კონფიდენციალობის პოლიტიკა მთლიანად ან ნაწილობრივ, მათ შორის,
              როდესაც ცვლილებები შედის სამართლებრივი დებულებებით ან
              რეგულაციებით, რომლებიც არეგულირებს მონაცემთა და თქვენი უფლებების
              დაცვას. კონფიდენციალობის პოლიტიკის შესწორებებისა და ცვლილებების
              შესახებ შეტყობინება მოხდება, როგორც კი ასეთი შესწორებები და
              ცვლილებები განხორციელდება და მათ სავალდებულო ძალა ექნება ამ
              ვებ-გვერდზე ამ განყოფილებაში გამოქვეყნებისთანავე. მაშასადამე,
              თქვენ მოგეთხოვებათ რეგულარული წვდომა გქონდეთ ამ განყოფილებაზე,
              იმისთვის რომ შეამოწმოთ უახლესი გამოცემები და konogima.com-ის
              განახლებული პოლიტიკა.
            </p>
            <h2>
              როგორ უნდა მოიქცეს მომხმარებელი თუ სურს რომ წაიშალოს მის შესახებ
              არსებული ინფორმაცია
            </h2>
            <p>
              თუ მომხმარებელს სურს რომ წაიშალოს მისი პროფილი და მთელი ის
              იმფორმაცია რომელსაც konogima.com ფლობს მის შესახებ, შეუძლია
              მოიწეროს konogiamcom@gmail.com მეილზე ან fb-ს საშუალებით.
              განაცხადის გაკეთებიდან უახლოეს პერიოდში ჩვენ წავშლით მთელს
              ინფორმაციას რაც ამ მომხმარებელთანაა დაკავშირებული.
            </p>
          </>
        ) : (
          <>
            <h2>სამომხმარებლო შეთანხმება</h2>
            <p>
              აღნიშნული სამომხმარებლო შეთანხმება აწესრიგებს ურთიერთობას
              konogima.com სერვისის ადმინისტრაციასა და სერვისის მომხმარებლებს
              შორის.
            </p>
            <ol>
              <li>
                სამომხმარებლო შეთანხმების ყველა პუნქტი განკუთვნილია konogima.com
                -ის ყველა მომხმარებლისათვის.
              </li>
              <li>
                konogima.com -ს ნებისმიერი სერვისის მოხმარებისას თქვენ
                ავტომატურად ეთანხმებით ქვემოთ მოცემული სამომხმარებლო შეთანხმების
                ყველა პუნქტს, წინააღმდეგ შემთხვევაში გთხოვთ, ნუ გამოიყენებთ
                konogima.com სერვისს.
              </li>
              <li>
                მიუხედავად იმისა, რომ konogima.com -ის ადმინისტრაცია ეცდება
                აცნობოს მოხმარებლებს შეთანხმებაში შესული მნიშვნელოვანი
                ცვლილებების შესახებ, სამომხმარებლო შეთანხმება შესაძლოა შეიცვალოს
                ადმინისტრაციის მიერ ყოველგვარი სპეციალური შეტყობინების გარეშე.
                შესაბამისად, სერვისის გამოყენებისას იხელმძღვანელეთ სამომხმარებლო
                შეთანხმების უახლესი ვერსიით, რომელიც ხელმისაწვდომია ყველა
                მოხმარებლისათვის.
              </li>
              <li>
                konogima.com შესაძლოა შეიცავდეს ბმულებს, რომლებიც მომხმარებლებს
                მესამე პირთა ვებსაიტებზე გადაამისამართებს. konogima.com არ არის
                პასუხისმგებელი ამგვარი ვებსაიტების შინაარსზე, მათ მიერ
                შემოთავაზებულ სერვისსა და მათ სამოხმარებლო შეთანხმებაზე.
                შესაბამისად, მომხმარებლის ვალდებულებაა საიტის დატოვებისას
                ყურადღება მიაქციოს და გაეცნოს მესამე მხარის სამომხმარებლო
                შეთანხმებასა და მოხმარების წესებს.
              </li>
              <li>
                იმისათვის რომ ისარგებლოთ konogima.com ის მიერ შემოთავაზებული
                სხვადასხვა სერვისით, მოხმარებელმა უნდა შექმნას საკუთარი
                ანგარიში. რეგისტრაციისას მომხმარებელმა უნდა მიუთითოს ზუსტი და
                სრული ინფორმაცია.
              </li>
              <li>
                დაუშვებელია სხვა მომხმარებლის ანგარიშის ნებართვის გარეშე
                გამოყენება. მომხმარებელმა აუცილებლად უნდა აცნობოს konogima.com -
                ის ადმინსიტრაციას მისი ანგარიშის სხვა პირის მიერ უნებართვოდ
                გამოყენების შემთხვევაში.
              </li>
              <li>
                საქართველოს ხელისუფლების მიერ ისეთი ნორმატიულ-საკანონმდებლო
                აქტების მიღების შემთხვევაში, რომლებიც მთლიანად ან ნაწილობრივ
                შეეხება საიტის ფუნქციონირებას, ადმინისტრაცია იტოვებს უფლებას
                ნებისმიერი ცვლილებები შეიტანოს საიტის ფუნქციონირებასა და
                სამოხმარებლო შეთანხმებაში, რათა ეს უკანასკნელი ახალ ნორმებს
                მიუსადაგოს.
              </li>
              <li>
                სამომხმარებლო შეთანხმების თაობაზე ყველა შესაძლო დავა გადაიჭრება
                საქართველოს საკანონმდებლო ნორმების თანახმად.
              </li>
            </ol>
          </>
        )}
      </article>
    </section>
  );
};

export default React.memo(Law);
