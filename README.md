# VocabRecall

## How to run

1. Navigate into the `vocabrecall-nextjs` directory.
2. Run `npm install`.
3. Run `npx prisma db push`.
4. Edit the `.env` if you want to alter default settings.
5. Run `npm run build`.
6. To start the program, run `npm run start`. This will start the application on port 3000.

## How to use a different port
Open `package.json` and change line 9 to `"start": "next start -p 8000",` (change 8000 to your desired port). Then start as normal with `npm run start`.
