export interface CustomPhrase {
  id: string;
  phrase: string;
  code: string;
  weight?: number;
}

export interface CustomPhrasesData {
  header: string;
  entries: CustomPhrase[];
}
