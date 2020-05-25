function todayFormatYMD(){
    const d = new Date();
    return d.toISOString().slice(0,10);
}

function dateFormatYMD(date){
    const d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    let day = d.getDate();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0"+month;

    let newDate = year+"-"+month+"-"+day;
    return newDate;
}

function newDateTime(day, hour){
    return new Date(day + " " + hour);
}

function dateFormatFrWH (date){
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    let hours = d.getHours();
    if ( hours < 10 ) {
        hours = "0"+hours
    }
    let minutes = d.getMinutes();
    if ( minutes < 10 ) {
        minutes = "0"+minutes
    }
    let monthFr = getMonthFr(month);

    return day + " " + monthFr + " " + year + " à " + hours + "h" + minutes
}

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

function getDaysLeft (date){
    const d = new Date(date);
    const today = new Date();
    let diff = Math.round((d - today) / (1000*3600*24));
    if (diff <  0) {
        diff =  Math.round((today - d) / (1000*3600*24));
    }
    return diff;
}

export default { todayFormatYMD, dateFormatYMD, newDateTime,
    dateFormatFr, getDaysLeft, dateFormatFrWH }