type LyricLine = {
    text: string;
    imageURL: string; 
    duration: number;
    from: number;
};

type Song = LyricLine[];