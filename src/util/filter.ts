const elapsed = (value: Date)=>{
    let now = Date.now();

    // time since message was sent in seconds
    let delta = (now - value.getTime()) / 1000;

    // format string
    if (delta < 60) { // sent in last minute
      return `${Math.floor(delta)}s ago`;
    } else if (delta < 3600) { // sent in last hour
      return `${Math.floor(delta / 60)}m ago`;
    } else if (delta < 86400) { // sent on last day
      return `${Math.floor(delta / 3600)}h ago`;
    } else { // sent more than one day ago
      return `${Math.floor(delta / 86400)}d ago`;
    }
}
const elapsed_lessago = (value: Date)=>{
    let str = elapsed(value);
    return str.slice(0, str.length - 4);
}

export default {
    filtersnow:{
        capitalize: (value)=>{
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
        uppercase : (value)=>{
            if (!value) return ''
            value = value.toString()
            return value.toUpperCase();
        },
        daysago: (value)=>{
            let date = null;

            try{
                date = new Date(value);
            }catch(err){
                date = null;
                console.error("Invalid Date");
            }
            if(!date){
                return ''
            }else{
                return elapsed(date);
            }
        },
        daysfilter: (value)=>{
            let date = null;

            try{
                date = new Date(value);
            }catch(err){
                date = null;
                console.error("Invalid Date");
            }
            if(!date){
                return ''
            }else{
                return elapsed_lessago(date);
            }
        },
        dateString : (value)=>{
            let date = null;
            try{
                date = new Date(value);
            }catch(err){
                date = null;
                console.error("Invalid Date");
            }
            if(!date){
                return ''
            }else{
                return date.toDateString().split(" ").slice(1,3).join(" ");
            }
        }
    }
         

}