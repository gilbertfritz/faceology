

var success = function(){
    console.log("SUCCESSS!!");
};

var error = function(message, response){
    console.log( "error!");
    console.log( "message: " + message);
    console.log( "response: " + response);
};

function sendMail(){
    
       apostle.domainKey = "70baa76215a80bbb5081e8d94aa0d638aaecff30";
       //apostle.domainKey = "70baa76215a80bbb5081e8d94aa0d638aaecff31";

       apostle.deliver('test', {email: 'hallo@gilbertfritz.com'}).then(success, error);
       
       console.log("mail has been send!");
       
}