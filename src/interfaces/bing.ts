// this is just the interface for the bing json response, it's here just to help with ts and vscode autocompletion
export interface BingJson {
  images: Image[];
  tooltips: Tooltips;
}

export interface Image {
  startdate: string;
  fullstartdate: string;
  enddate: string;
  url: string;
  urlbase: string;
  copyright: string;
  copyrightlink: string;
  title: string;
  desc: string;
  desc2: string;
  quiz: string;
  wp: boolean;
  hsh: string;
  drk: number;
  top: number;
  bot: number;
  hs: [];
}

export interface Tooltips {
  loading: string;
  previous: string;
  next: string;
  walle: string;
  walls: string;
}
