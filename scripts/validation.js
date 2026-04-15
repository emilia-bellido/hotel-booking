/*
VALIDATION LOGIC  AND MATH LOGIC
 */

/*
Global Variables
1)TOTAL : Total Sum of all rooms, taxes and dicounts
2)Form template: Form in HTML that gets saved; when user finalizes payment or modal is closed its reset to form. Not other text
3)Total Guests: used for confirmation message and is accessed from form validation
4)userName: used for confirmation message and is accessed from form validation
 */


let total;
const formTemplate = $("#priceDetails").html();
let totalGuests;
let userName;

//Groups an array of booked rooms by their respective hotelId ({hotelId: [{room 1}, {room 2},...]})
//When a user books multiple rooms in multiple hotels, it will only let them pay for one ,hotel at a time.
const groupAllRoomsByHotel = (room_info) =>{

    //empty object will hold arrays of rooms with respective hotel id
    let groupedHotels = {};

    for (let i = 0; i < room_info.length; i++) {

        //grab the hotel id of all the rooms
        let hotelId = room_info[i].hotelId;

        let room = room_info[i];

        //if groupedHotels already has the hotelID = > PUSH the room to that key
        if(!groupedHotels[hotelId]){
          groupedHotels[hotelId] = []; //if it doesnt, create an empty key (hotelID) with that new room as the value
        }

        //based on the hotelId,  push the room to that array with the key of hotel id
        groupedHotels[hotelId].push(room);
    }

    //Object.values(array) --> gives me all  the rooms in the first hotel
    console.log("First group" , Object.values(groupedHotels)[0]);
    return groupedHotels;
}

//Grab the first key in groupedHotels, and loop through  its values (array of rooms) and apply the payment summary
const hotelBookedSummary = (groupedHotels) =>{

    //Array of rooms within the same first hotel on our " list"
    const rooms_sameHotel = Object.values(groupedHotels)[0];

   //Get the name of the current hotel where all the rooms are at using hotelName(hotelId) function
   const currentHotelName = hotelName(parseInt(Object.keys(groupedHotels)[0]));

    //Weather was saved to localStorage when it was initially booked
    const hotelWeather = rooms_sameHotel[0].weather;

    //make the cost "box summary" for every room and join them by separating them with a <br>
   const allRoomHTML = rooms_sameHotel.map(room => {
       return paymentSummary_details(room, room.nights);
   }).join(`<br>`);

    //return an Object with key: html and key: weather
   return{
    html:`
        <div id="hotelName">
            <h5 class="text-center">${currentHotelName}</h5>
        </div>
        <div id="rooomsSummary">
            ${allRoomHTML}
        </div>`,
    weather: hotelWeather

   };
}

//Saves the multiplication of each individual room (price * nights) to later add them
let subtotalRooms = [];

const paymentSummary_details = (room, nights) =>{

    //accessing the name, price and maxguest of room
    let {name, pricePerNight, maxGuests} = room;

    //math
    let subtotal = room.pricePerNight * nights;

    //adding to subtotal array so its accesible to calculate the grand total
    subtotalRooms.push({total: subtotal});

    //return a payment summary for one room
    return(`
    <div class="container rounded border">
        <h5 class="text-center">Accomodation Details</h5>
            <div class="row">
                <div class="col-6 text-muted" > Suite/Room </div>
                <div class="col-6 fw-bold" id="roomBooked"> ${name} </div>
            </div>
            <div class="row"> 
                <div class="col-6 text-muted"> Nightly Rate </div>
                <div class="col-6 fw-bold" id="nightBooked"> $${pricePerNight}</div>
            </div>
            <div class="row"> 
                <div class="col-6 text-muted">Duration of Stay</div>
                <div class="col-6 fw-bold" id="nightBooked"> ${nights}</div>
            </div>
            <div class="row">
                <div class="col-6 text-muted"> Occupancy </div>
                <div class="col-6 fw-bold" id="guestBooked"> ${maxGuests} </div>
            </div>
            <div class="row">
                <div class="col-6 text-muted"> Subtotal </div>
                <div class="col-6 fw-bold" id="subTotal"> $${subtotal} </div>
            </div>
        </div> `);
}

/*
Defines weather promo discount based on weather data saved when room was booked.
Condition values range from thunder, to sunny.
Switch(true) checks the data and sees if any of the key words are part of it. True: that discount is applied.
False: checks the next possibility
 */
const calculateWeatherPromo = (weatherCondition, totalRoomsCost) => {

    //grabbing the condition that was saved in the localStorage
    let condition =  weatherCondition.toLowerCase();

    //promo Object has a name, amount of discount
    let promo = {
        name: "",
        amount: 0
    };

    //Checks if the weather condition contains any of the weather key words:
    switch (true) { //true because includes returns either true or false

        //case 1: if condition contains thunder OR blizzard then promo.name is "" and amount(calculated directly from roomCost) is ""
        case condition.includes("thunder") || condition.includes("blizzard"):
            promo.name = " Severe Weather Courtesy (15% Off) )";
            promo.amount = totalRoomsCost * 0.15;
            break;

        case condition.includes("snow") || condition.includes("ice") || condition.includes("freezing") || condition.includes("sleet"):
            promo.name = "Winter Staycation Courtesy (-$40.00)";
            promo.amount = 40.00;
            break;

        case condition.includes("rain") || condition.includes("drizzle") || condition.includes("shower"):
            promo.name = "Rainy Retreat Discount (10% Off)";
            promo.amount = totalRoomsCost * 0.10;
            break;

        case condition.includes("fog") || condition.includes("mist"):
            promo.name = "Misty Morning Spa Promo (5% Off)";
            promo.amount = totalRoomsCost * 0.05;
            break;

        case condition.includes("cloudy") || condition.includes("overcast"):
            promo.name = "Cloudy Day Cafe Credit (-$15.00)";
            promo.amount = 15.00;
            break;

        case condition.includes("sunny") || condition.includes("clear"):
            promo.name = "Atelier Sunshine Premium (-5%)";
            promo.amount = -(totalRoomsCost * 0.05);
            break;
        //if none result; then promo object returns empty
        default:
            break;
    }

    return promo;
};


//format number function: contain commas and decimal numbers
const formatNumber = (number) => {
    return number.toLocaleString(`en-US`, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

//Adds all the rooms, & applies weather discount
const totalPaymentSummary = (subtotal, weatherCondition) =>{

    let totalRooms = 0;

    //add all the subtotals of the rooms
    for(let i = 0; i < subtotal.length; i++){
        totalRooms += subtotal[i].total;
    }
    //Rooms will be in same hotel => one weather condition
    //Check  the weatherCondition and pass the total amount of all rooms in that hotel
    let promo = calculateWeatherPromo(weatherCondition, totalRooms);

    //apply discount
    let discountedSubtotal = totalRooms - promo.amount;

    //calculate taxes of all the rooms combined after discount
    let taxes = discountedSubtotal * 0.13;

    // calculate final total with taxes
    total = discountedSubtotal + taxes;

    return(`
    
    <div class="container rounded border p-2 mt-2">
        <div class="row">
            <div class="col"> Subtotal (All Rooms) </div>
            <div class="col text-end" id="subTotalRooms"> $${formatNumber(totalRooms)} </div>
        </div>
        
        <div class="row mb-2">
            <div class="col" id="discountWeather"> <span> Weather Promo Applied: </span>${promo.name} </div>
            <div class="col text-end" > - $${formatNumber(Math.abs(promo.amount))} </div>
        </div>
        
        <div class="row">
            <div class="col"> <span> Subtotal (Promo Included) </div>
            <div class="col text-end fw-bold" > $${formatNumber(discountedSubtotal)} </div>
        </div>
        
        <div class="row">
            <div class="col"> Taxes</div>
            <div class="col text-end fw-bold" id="taxes"> $${formatNumber(taxes)} </div>
        </div>
        <hr>
        <div class="row h5">
            <div class="col"> Total</div>
            <div class="col text-end" id="total"> $${formatNumber(total)} </div>
        </div>
    </div>
`)
};

//Confirmation for payment and booking = once paid room is removed from storage
$(document).on('click', '.reserve_btn',  () =>{

    //check the storage
    let room_list = localStorage.getItem("roomBookedHistory");

    //use window.room_info so all room_info in both files are updated and there isnt bugs after checkout
    window.room_info = checkRoomInfo(room_list);

    //group all rooms by hotel
    let grouped = groupAllRoomsByHotel(room_info);

    //get the id of the first object (hotelID)
    let targetHotelId =  Object.keys(grouped)[0];

    //reverse loop so indexes dont change when deleting them
    for(let i = room_info.length - 1; i >= 0; i--){
        //if the room matches the hotelId, the remove it
        if(room_info[i].hotelId == targetHotelId){
            let roomId = room_info[i].id;
            room_info.splice(i, 1);
            badge_remove();
        }
    }

    //updating storage up with new information
    localStorage.setItem("roomBookedHistory", JSON.stringify(room_info));

    //show confirmation message and clearing previous html
    $("#priceDetails").html('');

    //global variables set at top are used here
    $("#priceDetails").html(`
     <div id="confirmationMsg" class="p-2">
            <h4 class="emphasis-font text-center"> <i class="bi bi-check emphasis-font "></i> Booking Confirmed!</h4>
            <div class="text-center">
                <p>Thank you, <strong> ${userName}</strong> for your booking.<br>
                    Your reservation for <strong>${totalGuests}</strong> guests has been placed successfully.</p>
                <p>Total Charged: <strong id="confirmedTotal">$${formatNumber(total)}</strong></p>

            </div>

     </div>
    `)

    show_rooms(room_info); //update the rooms in cart
    $('.reserve_btn').addClass('d-none'); //hide the reserve button as review details button will go first
    $('#close').text('Close'); //changing text from cancel to close

    //resetting room_info, rooms cost, and badge so bugs in localStorage or cart

    //ressetting global variable of room_info by getting what is in storage after deletion
    window.room_info = checkRoomInfo(localStorage.getItem("roomBookedHistory"));
    subtotalRooms = []; //resseting array of individual total pricesfor every room
    showBadge(); //update badge


})

/*
Validation: 2 PARTS
1) User validation
2)Card Validation
 */
const personalInfoValidation = () => {
    //array of objects that contain, the id of input, regex, and error message
    const validationRule = [
        {id: "firstName", regex: /^[A-Za-z]+$/, error: "Letters only, no spaces"},
        {id: "lastName", regex: /^[A-Za-z]+$/, error: "Letters only, no spaces"},
        {id: "emailUser", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "Enter a valid email"},
        {id: "address", regex: /^[a-zA-Z0-9\s,.'-]{3,}$/, error: "Minimum 3 characters (A-Z, 0-9)"},
        {id: "city", regex: /^[a-zA-Z\s\-]{2,}$/, error: "Letters and hyphens only"},
        {id: "province", regex: /^[a-zA-Z0-9\s,.'-]{2,}$/, error: "Minimum 2 characters (Letters only)"},
        {id: "postalCode", regex: /^([A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]|\d{5})$/i, error: "Format: A1B 2C3 or 12345"},
        {id: "phoneNum", regex: /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/, error: "Format: 000-000-0000"},
        {id: "guests", regex: /^[1-9][0-9]*$/, error: "Please enter a valid number of guests"}
    ];

    //assume the form is valid
    let isFormValid = true;

    //loop through all the values, check validation rules
    for (let i = 0; i < validationRule.length; i++) {

        let rule = validationRule[i]; //id, regex, error

        let inputBox = $(`#${rule.id}`); //target input with jquery and backticks # ${}
        let inputValue = inputBox.val(); //target input value
        let regex = rule.regex; //get regex so can be tested

        let validationResult; //true or false after it passes regex
        //For every object try validation
        /*
        false: turn the form false, (is it empty or wrong input) , empty => "cannot be empty",
        wrong input =>"show error message from object"
        true: remove error UI
        do it until all inputs pass. if one input is false the whole form doesnt pass
         */
        try {
            validationResult = regex.test(inputValue);
            if (validationResult === false) {
                isFormValid = false;
                inputBox.parent().removeClass('inputSuccess').addClass('inputError rounded-2');
                if (inputValue === "") {
                    inputBox.attr('placeholder', 'This field cannot be empty');
                } else {
                    inputBox.val(""); // Clear the bad input
                    inputBox.attr('placeholder', rule.error);
                }
                throw new Error("Could not validate user Input")

            } else {
                inputBox.parent().removeClass("inputError").addClass('inputSuccess rounded-2');
            }
        } catch (e) {
            console.log(e.message);
        }
    }
    return isFormValid;
}

/*
Same logic as above, different inputs, regex, and error messages that are visible once the frist part of the form is validated (why its separated in two)
 */
const paymentInfoValidation = () => {

    const validationRule = [
        {id: "nameCard", regex: /^[a-zA-Z\s]+$/, error: "Letters and spaces only (as shown on card)"},
        {id: "cardNum", regex: /^(\d{4}\s?){4}$/, error: "Enter a valid 13-16 digit credit card number"},
        {id: "expirationDate", regex: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/, error: "Use MM/YY format (e.g., 05/28)"},
        {id: "securityCode", regex: /^[0-9]{3,4}$/, error: "Enter the 3 or 4 digit code on the back"}
    ];

    let isFormValid = true;

    //loop through all the values, check validation rules
    for (let i = 0; i < validationRule.length; i++) {

        let rule = validationRule[i];
        let inputBox = $(`#${rule.id}`);
        let inputValue = inputBox.val();
        let regex = rule.regex;
        let validationResult;

        try {
            validationResult = regex.test(inputValue);

            if (validationResult === false) {
                isFormValid = false;
                inputBox.parent().removeClass('inputSuccess').addClass('inputError rounded-2');

                if (inputValue === "") {
                    inputBox.attr('placeholder', 'This field cannot be empty');
                } else {
                    inputBox.val("");
                    inputBox.attr('placeholder', rule.error);
                }

                throw new Error(`Could not validate ${rule.id} input`);

            } else {
                inputBox.parent().removeClass("inputError").addClass('inputSuccess rounded-2');
            }

        } catch (e) {
            console.log(e.message);
        }
    }

    return isFormValid;
}

//Checkout button : form validation, change of HTML and buttons
$(".checkout_btn").on("click", (e) => {

    e.preventDefault();

    //ressetting any values from past transactions so the sum is accurate
    subtotalRooms = [];

    // Check if card section is hidden
    let isCardSectionHidden = $("#toggleDownCardDetails").is(":hidden");

    //Card selection is hidden (should be default)
    //First check the personalInfoValidation() --> passes then show the cardSection
    if (isCardSectionHidden) {
        //STEP 1: validate only user info
        if (personalInfoValidation()) {
            //validation: show card form and change the text of checkout button to review final summary
            $("#toggleDownCardDetails").removeClass("d-none").hide().slideDown("slow");

            $(".checkout_btn").text("Review Final Summary");
        }

    } else { //STEP 2: ard section is already showing(personal info must have been validated before, do validation of payment)
        if (paymentInfoValidation()) {

            try {
                subtotalRooms = [];
                totalGuests = $("#guests").val(); //save to global so confirmation message can access it
                userName = $("#firstName").val();

                $("#modalTileText").addClass("d-none"); //hide the header with "contact info..."

                //load and parse rooms from storage
                let room_list = localStorage.getItem("roomBookedHistory");
                let parsedRooms = checkRoomInfo(room_list);


                if (parsedRooms.length === 0) {
                    throw new Error("Cannot checkout because the cart is Empty");
                }

                //1) Group rooms by hotel
                let grouped = groupAllRoomsByHotel(parsedRooms);

                // 2) Grab first group of rooms grouped by hotelID: returns individual pay summaries for every room and the weather data
                let summaryData = hotelBookedSummary(grouped);

                //3) accessing both keys from return above
                let summaryHTML = summaryData.html;
                let activeWeather = summaryData.weather;

                //4)Full price breakdown HTML using weather promo
                let mathHTML = totalPaymentSummary(subtotalRooms, activeWeather);

                // add the price to html
                $("#priceDetails").html(summaryHTML + mathHTML);

                //swap buttons: checkout for reserve now that the summary is shwoing
                $(".checkout_btn").hide();
                $(".reserve_btn").removeClass("d-none");

            } catch (error) {
                console.log(error);
                //show error in modal and hide checkout button so user cant retry
                $("#priceDetails").html(`<div class="alert alert-danger">Error: ${error.message}</div>`);
                $(".checkout_btn").addClass("d-none");

            }
        }
    }
})

//Resets the modal to:
/*
1) original form
2) clears inputs, puts back placeholders by form[0[.reset
3) removes classes that show wrong input or right input
4)shows the header of modal again
5)hides card details form
6)shows checkout button again
 */
$('#checkout').on('hidden.bs.modal', function (e) {
    $("#priceDetails").html(formTemplate);
    $("#userForm")[0].reset();
    $('#userForm input').parent().removeClass("inputError inputSuccess");
    $('#modalTileText').removeClass('d-none');
    $("#toggleDownCardDetails").addClass("d-none");
    $(".checkout_btn").text("Continue to Summary").show();
    $(".checkout_btn").removeClass("d-none");

})

