function getMonthFr(month){
    let monthFr = "";
    switch (month) {
        case 0:
            return monthFr = "Janvier";
            break;
        case 1:
            return monthFr = "Février";
            break;
        case 2:
            return monthFr = "Mars";
            break;
        case 3:
            return monthFr = "Avril";
            break;
        case 4:
            return monthFr = "Mai";
            break;
        case 5:
            return monthFr = "Juin";
            break;
        case 6:
            return monthFr = "Juillet";
            break;
        case 7:
            return monthFr = "Août";
            break;
        case 8:
            return monthFr = "Septembre";
            break;
        case 9:
            return monthFr = "Octobre";
            break;
        case 10:
            return monthFr = "Novembre";
            break;
        case 11:
            return monthFr = "Décembre";
            break;
    }
}

function dateFormatFr (date){
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    let monthFr = getMonthFr(month);

    return day + " " + monthFr + " " + year
}
module.exports = dateFormatFr;

