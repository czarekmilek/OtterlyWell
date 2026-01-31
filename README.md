# OtterlyWell
**OtterlyWell** to aplikacja webowa służąca jako centralny hub do organizacji codziennego życia i monitorowania well-beingu. Projekt łączy w sobie funkcjonalności z zakresu dietetyki, aktywności fizycznej, finansów oraz zarządzania zadaniami w jednym, spójnym systemie.

Aplikacja została zrealizowana jako **praca inżynierska** na Uniwersytecie Wrocławskim.

## Funkcjonalności
Aplikacja składa się z modularnej architektury, pozwalającej użytkownikowi na wybór aktywnych komponentów:
- **Pulpit**: Centralny widok prezentujący podsumowania z aktywnych modułów w formie widgetów.
- **Moduł żywieniowy**: Dziennik kalorii i makroskładników, wyszukiwanie produktów (integracja z OpenFoodFacts), definiowanie celów żywieniowych.
- **Moduł fitnessowy**: Baza ćwiczeń, kreator planów treningowych, dziennik aktywności.
- **Moduł finansowy**: Monitorowanie budżetu, rejestr przychodów i wydatków, kategoryzacja transakcji, planowanie budżetów miesięcznych.
- **Moduł zadaniowy**: Tablica zadań do organizacji pracy, priorytetyzacja i kategoryzacja zadań.

## Technologie
Projekt został wykonany w następującym stosie technologicznym:
- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Headless UI](https://headlessui.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend (BaaS)**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Edge Functions)

## Wersja demonstracyjna
Aplikacja jest hostowana z pomocą Github Pages i dostępna w
[przeglądarce](https://czarekmilek.github.io/OtterlyWell/)

## Konfiguracja i uruchomienie
### Wymagania wstępne
- [Node.js](https://nodejs.org/) (zalecana wersja LTS)
- Git
### Uruchomienie
1.  Sklonuj repozytorium:
    ```bash
    git clone https://github.com/czarekmilek/OtterlyWell/
    cd OtterlyWell
    ```
2.  Zainstaluj zależności:
    ```bash
    npm install
    ```
3.  Skonfiguruj zmienne środowiskowe -
    utwórz plik `.env` w głównym katalogu projektu i wypełnij go danymi twojego projektu Supabase:
    ```env
    VITE_SUPABASE_URL=twoj_url_supabase
    VITE_SUPABASE_ANON_KEY=twoj_klucz_anon_supabase
    VITE_SUPABASE_FUNCTIONS_URL=url_do_edge_functions
    ```
    > `VITE_SUPABASE_FUNCTIONS_URL` jest wymagany do działania wyszukiwarki produktów (przez OpenFoodFacts).
4.  Uruchom serwer deweloperski:
    ```bash
    npm run dev
    ```

### Budowanie wersji produkcyjnej
Aby zbudować aplikację do folderu `dist`:
```bash
npm run build
```
