// response json
export interface InfoJson {
  desc?: {
    title?: string;
    short?: string;
    long?: string;
  };
  credits: {
    copyright: string;
    urls?: {
      copyright?: string;
      image?: string;
    };
  };
}
export interface FinalJson {
  provider: string;
  url: string;
  info: InfoJson;
}
