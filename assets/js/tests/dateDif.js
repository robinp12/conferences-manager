function getDaysLeft (date){
    const d = new Date(date);
    const today = new Date();
    return Math.round((d-today) / (1000*3600*24));
}

module.exports = getDaysLeft;
