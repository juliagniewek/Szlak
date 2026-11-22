# F02 · Zapisywanie miejsc
**Status:** do zrobienia · **Priorytet:** MVP-1 · **Złożoność:** średnia → poziom Średni — pierwszy zapis danych użytkownika w przeglądarce, bez danych osobowych i usług zewnętrznych
**Zależy od:** F01 · **Źródło:** brief (Zapisane), prototyp, specyfikacja-v1.md (US1), DEC-2

## Do przeczytania
AGENTS.md · docs/specyfikacja.md: sekcja 6 (Zapisane miejsce), sekcja 7 (N1, N2, N5) · design.md: karta miejsca (serce), komunikat (toast) · prototyp.html: serce na kartach, ekran Zapisane

## Cel
Użytkownik zapisuje miejsce sercem i znajduje je w Zapisanych także po zamknięciu przeglądarki.

## Zachowanie
1. Na kartach (E1) i w E3 jest serce. Kliknięcie zapisuje miejsce: serce się wypełnia, licznik przy „Zapisane” w menu rośnie, pojawia się komunikat „Zapisano „Koloseum”. Znajdziesz je w zakładce Zapisane.”
2. Ponowne kliknięcie usuwa zapis i pokazuje komunikat „Usunięto „Koloseum” z Zapisanych.” (jeśli miejsce jest w podróży: „… W podróży nadal zostaje.”, N2).
3. E4 Zapisane: karty zapisanych miejsc, najnowsze na górze, z sercem.
4. Stan pusty E4: „Nie masz jeszcze zapisanych miejsc” i przycisk „Odkrywaj miejsca”.

## Dane
Tworzy i usuwa Zapisane miejsce (miejsce, data zapisu). Zapis tylko w przeglądarce, przez jedno miejsce zapisu z F00.

## Kryteria akceptacji
- F02-KA1 [test]: Gdy kliknę serce przy „Koloseum”, to serce jest wypełnione, a licznik przy „Zapisane” zmienia się z 0 na 1.
- F02-KA2 [test]: Gdy zapiszę „Koloseum”, a potem „Panteon”, to na E4 „Panteon” jest pierwszy, a „Koloseum” drugi.
- F02-KA3 [test, ręcznie]: Gdy zapiszę miejsce i odświeżę stronę albo zamknę i otworzę przeglądarkę, to miejsce nadal jest na E4 (N5).
- F02-KA4 [test]: Gdy kliknę serce zapisanego miejsca, to znika ono z E4, a licznik maleje; dwa szybkie kliknięcia z rzędu nie tworzą dwóch zapisów.
- F02-KA5 [test]: Gdy przeglądarka blokuje zapis (atrapa z F00), to nad treścią jest ostrzeżenie „Ta przeglądarka nie pozwala zapisywać danych. Wszystko zniknie po zamknięciu strony.”, a zapisywanie działa do zamknięcia strony (A5).
- F02-KA6 [test]: Gdy zapisuję i usuwam miejsce, to aplikacja nie wysyła żadnego żądania sieciowego (N1).

## Przypadki brzegowe i błędy
- Zapisane miejsce, którego nie ma już w katalogu: nie psuje E4; zachowanie według docs/plan.md.
- Błąd zapisu w przeglądarce (np. brak miejsca): komunikat o błędzie, bez komunikatu „Zapisano”; stan serca zgodny z tym, co naprawdę zapisano.

## Ochrona danych
P0. Brak danych osobowych. Testy na zestawie testowym z F00.

## Poza zakresem tej karty
Kolekcje (Później), zaznaczanie miejsc i tworzenie podróży (F04).

## Jak sprawdzić ręcznie
1. Zapisz dwa miejsca, otwórz Zapisane i sprawdź kolejność.
2. Zamknij przeglądarkę, otwórz aplikację ponownie i sprawdź Zapisane.
3. Usuń zapis sercem i sprawdź licznik.
