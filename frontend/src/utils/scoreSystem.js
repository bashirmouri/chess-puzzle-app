const scoreSystem = (time, tries, streak) => {

    let points = 100; // base points

    if (time < 5) points += 50;
    else if (time < 10) points += 30;
    else if (time < 15) points += 20;
    else if (time < 30) points += 10;

    console.log("tries:" ,{tries});

    if (tries === 0) {
        points += streak * 20;
    }

    return points;

}

export default scoreSystem;