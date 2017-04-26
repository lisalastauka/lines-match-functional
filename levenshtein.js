function  levenstein(word, term) {
    if (word === term) { return 0}
    let v0 = new Array(term.length + 1);
    for (let i = 0; i < v0.length; i++){
        v0[i] = i
    }
    let v1 = new Array(term.length + 1);

    for (let i = 0; i < word.length; i++){
        v1[0] = i + 1;
        for (let j = 0; j<term.length; j++ ){
            let cost = word.charAt(i) === term.charAt(j) ? 0 : 1;
            v1[j+1] = Math.min(v1[j]+1, v0[j+1]+1, v0[j]+cost);
        }
        let tmp = v0;
        v0 = v1;
        v1 = tmp;
    }

    return v0[term.length];
}