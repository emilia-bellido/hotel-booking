
//Hotel class
class Hotel{
    constructor(id, name, city, country, lat, long, rating, description, image, icon){
        this.id = id;
        this.name = name;
        this.city = city;
        this.country = country;
        this.latitude = lat;
        this.longitude = long;
        this.rating = rating;
        this.description = description;
        this.image = image;
        this.icon = icon;
    }

    //returns card for hotel
    makeHotel() {
        return `
        <div id="hotelDetails" class="p-4">
            <div class="card hotel_showcase shadow-lg h-100" >
                <img id="card-img-top hotel-img" class="rounded" src="${this.image}" alt="Hotel Image" >
                <div class="card-body p-4">
                    <div class="d-flex flex-column  justify-content-between align-items-center mb-4">
                        <div>
                            <h2 id="hotelNameDisplay" class="bold-font text-center" >${this.name}</h2>
                            
                            <div class="d-flex flex-row justify-content-between"> 
                                <p id="hotelCityDisplay" class="light-font text-uppercase mb-2">
                                    <i class="bi bi-geo-alt-fill me-1" style="color: var(--gold);"></i> ${this.city}, ${this.country}
                                </p>
                                <div id="hotelRatingDisplay" style="color: var(--gold);">
                                    ${this.starsRating()}
                                </div>
                            </div>
                        </div>
                        <div id="weatherDisplay" class="d-flex flex-wrap align-items-center p-1 justify-content-center">
                            <div id="feelsLike" class="light-font p-2 text-center m-0"></div>
                            <div id="weatherTemp" class="light-font p-2 text-center m-0"></div>
                            <div id="weatherCondition" class="light-font p-2 text-center m-0" ></div>
                            <div> <img id="weatherIcon" class="object-fit-contain " alt="weather"></div>
                             
                        </div>
                        <p id="hotelDescDisplay" class=" light-font text-center pt-2">
                                ${this.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    //returns an amount of stars according to rating (rounded)
    starsRating(){
        //producing the stars for rating
        let fullRating = "";
        for (let i = 0; i < Math.round(this.rating); i++) {
            fullRating += `<i class="bi bi-star-fill"></i> `;
        }

        return fullRating;
    }
}


//Class for rooms
class Room {
    constructor(id, hotelId, name, type, beds, maxGuests, pricePerNight, rating, available, image) {
        this.id = id;
        this.hotelId = hotelId;
        this.name = name;
        this.type = type;
        this.beds = beds;
        this.maxGuests = maxGuests;
        this.pricePerNight = pricePerNight;
        this.rating = rating;
        this.available = available;
        this.image = image;
    }
    //returns strings whether or not boolean is true
    availability(){
        if(this.available){
            return "Available";
        }else{
            return "Unavailable";
        }

    }
}


//Helper functions that need to be accessed by other JS file

//checking Room quantity (1,2)  so can be shown in badge
let checkCartTotal = (currentStored) =>{
    //if currentStore is a valid num then parse it into an int / else return 0
    if(currentStored && !isNaN(currentStored)){
        return parseInt(currentStored);
    }else{
        return 0;
    }
}


// Store local storage in variable = will return a string
let currentStored = localStorage.getItem("Items");

//Cart Total = int number for html badge
let cartTotal = checkCartTotal(currentStored);

//Checks the rooms with full info in the Storage
const checkRoomInfo = (room_list) =>{
    //if local storage has anything : return it and parse it / if none return empty array
    if (room_list){
        return  JSON.parse(room_list);
    }else{
        return [];
    }
}


//Remove a room info from array and update storage
//room_info = array of data for every room
const roomRemoveFromStorage = (roomId, room_info) => {

    //== so if its a string or an int it will match
    const index = room_info.findIndex((room) => room.id == roomId);

    // findIndex returns -1 if not found, so > -1 means a valid index was found
    if (index > -1) {
        // go to index , and only remove one position  (the targeted room )
        room_info.splice(index, 1);
        //update storage
        localStorage.setItem("roomBookedHistory", JSON.stringify(room_info));

        // Re-render the cart
        show_rooms(room_info);
        return true;
    }

    return false;
}

//update room info HTML in cart
const show_rooms = (room_info) => {
    //subtotal
    let cartSubtotal = 0;
    //clear it so no rooms from before will show
    $('#cartHistory').html('');


    if (room_info.length >= 1) {
        $("#subTotalCart").removeClass("d-none");

        for (let i = 0; i < room_info.length; i++) {
            room_add(room_info[i]);
            cartSubtotal += (room_info[i].pricePerNight * room_info[i].nights);
        }

        $("#subTotalCart").html(`
            <h5 class="col-6 m-0">Cart Subtotal:</h5>
            <h5 class="col-6 m-0 text-end fw-bold">$${formatNumber(cartSubtotal)}</h5>
        `)
    } else { //emtpy cart
        $("#subTotalCart").addClass("d-none");
        $("#cartHistory").html("<h5 class='text-center'> Empty Cart </h5>");
    }


}

//removes number from badge / update storage for quantity that shows on cart
const badge_remove = () => {

    try{
        if(cartTotal >= 1){ //only if room is greater than 0
            cartTotal--;
            localStorage.setItem("Items", cartTotal);
        }

        if(cartTotal <= 0){ //its less han 0 or 0
            cartTotal = 0;
            localStorage.setItem("Items", "0");
            //stop execution
            throw new Error ("Cart is Empty.");

        }
    }catch(error){
        console.log(error.message);
    }finally{
        showBadge();
    }

};


//Updates badge
const showBadge = () => {
    //show if cartTotal is more than 1
    if (cartTotal >= 1) {
        $('.cartNum').removeClass("d-none").text(cartTotal);
    } else if (cartTotal <= 0){
        $('.cartNum').addClass("d-none");
    }
    console.log("Current Badge Value:", cartTotal);
};

//add a new number to badge / update storage
const badge_add = () => {
    cartTotal++;
    localStorage.setItem("Items", cartTotal);
    showBadge();

};


//Renders the book for the cart
const room_add = (room) => {

    $("#cartHistory").append(`
            <div class="card mb-3"> 
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${room.image}" class="rounded" alt="..."  style="width: 100% ; height: 100%; object-fit: cover">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title bold-font"> ${room.name}</h5>
                            <p class="card-text m-0"><strong>Destination:</strong> ${hotelName(room.hotelId)} </p>
                            <p class="card-text m-0"><strong>Duration of Stay:</strong> ${room.nights} nights </p>
                            <p class="card-text m-0"><strong>Rate per Night:</strong> $${room.pricePerNight}</small></p>
                            <button type="button" class="btn btn-primary btn-sm deleteRoom" data-index="${room.id}">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        `)

}

//find the hotel name with an id
const hotelName =  (id) => {

    let hotel;
    //try and catch so it doesnt break my cards
    try{
        let hotel = hotelObjects.find((hotel) => hotel.id == id);


        if(hotel == null){
            throw new Error("Hotel not found");

        }

        return hotel.name;
    }catch(error){
        console.log(error.message);
        return "Unknown Hotel";
    }
}

//Fetching Data from json files
let hotels = "public/hotels.json";
let rooms = "public/rooms.json";
let hotelObjects; //array of instances
let roomObjects; //array of instances
window.room_info = [];
$(document).ready(() => {

    //Store the ID of the current Hotel so it can be accessed by different functions
    let currentHotelId = null;

    //Check if there is anything in remote storage: room information
    let room_list = localStorage.getItem("roomBookedHistory");
    window.room_info = checkRoomInfo(room_list);


    //hotel fetch  call: getting data from my hotel.json and convert them into hotel objects
    const hotel_call = async () => {
        try{
            const response = await fetch(hotels);
            //if no response
            if(!response.ok){
                throw new Error("Unavailable Hotel information");
            }

            const hotels_data = await response.json();

            //getting an array of Objects of Hotel Class
            hotelObjects = hotels_data.map(hotel => new Hotel(hotel.id, hotel.name, hotel.city, hotel.country,
                hotel.lat, hotel.lng, hotel.rating, hotel.description, hotel.image, hotel.icon));
            return hotelObjects;

        } catch(error){
            console.log(error.message);
        }

    }




    //room fetch call: getting data form rooms.json and putting into an array "roomObjects"
    const room_call = async () => {

        try{
            const response = await fetch(rooms);

            if(!response.ok){
                throw new Error("Unavailable Room information");
            }
            const rooms_data = await response.json();
            return roomObjects = rooms_data.map(room => new Room(room.id, room.hotelId, room.name, room.type, room.beds, room.maxGuests,
                room.pricePerNight, room.rating, room.available, room.image))

        }catch(error){
            console.log(error.message);
        }

    }



    /* MAP SETUP */
    let map;
    let marker;

    //creating a base icon function to create multiple icons for different hotel lcoations
    const iconBase = L.Icon.extend({
        options: {
            shadowUrl: 'images/icons/icon-shadow.png',
            iconSize:     [60, 60],
            shadowSize:   [90, 90],
            iconAnchor:   [30, 60],
            shadowAnchor: [45, 90],
            popupAnchor:  [0, -65]
        }

    });

    const createIcons = async () => {
        //need to fetch the hotels first
        await hotel_call();

        const  icons = {}; //array of objects hotelid: icon

        for (let i = 0; i < hotelObjects.length; ++i) {
            const hotelId = hotelObjects[i].id;
            const iconPath = hotelObjects[i].icon;
            icons[hotelId] = new iconBase ({iconUrl: iconPath});

        }
        return icons;

    }

    const map_position = async () => {
        //WAIT until the fetch calls are done before building the map. Cant build a map without coordinates
        await hotel_call();
        await room_call();

        //generate hotel icons
        const hotelIcons = await createIcons();

        //Setting the map to Canada
        map = L.map('map').setView([56.1304, -106.3468], 4);

        //Adding the Tile layer = so you can actually see the  map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);


        /*
        When a marker is clicked do:
        Store the id = so we can later access the rooms and display them
         */

        let hotel_id_marker;

        const onMarkerClick = async (e) => {

            //clear current rooms being show for another hotel
            $('#roomCards').html('');

            //grabbing the piece of data we put with each marker, by clicking on the marget we can access the data
            hotel_id_marker = e.sourceTarget.data;

            //update currentHotelId
            currentHotelId = hotel_id_marker;

            //Find that hotel in my array
            let hotel = hotelObjects.find((hotel) => hotel.id === hotel_id_marker);
            console.log(hotel);
            //focus on that location
            map.flyTo([`${hotel.latitude}`, `${hotel.longitude}`], 10);

            //display hotelinfo
            $("#activeHotel").html(hotel.makeHotel());

            //get weather information
            const weather = await weather_call(hotel.city);

            //make the cards according to the id of the hotel
            let matchingRooms = hotels_with_rooms(hotel_id_marker)
            room_cards(matchingRooms, hotelName(hotel_id_marker));



            //show filter
            $('#filterLabel').removeClass('d-none');

        }

        //adding a marker for every hotel
        for(let i = 0; i < hotelObjects.length; i++){

            let customIcon = hotelIcons[hotelObjects[i].id]

            marker = L.marker([hotelObjects[i].latitude, hotelObjects[i].longitude], {icon:customIcon}) //adding  a marker
                .addTo(map)
                .bindPopup(hotelObjects[i].name); //when you click on it you see the name of it

            //storing a unique identifier for all the markers = hotel.id
            marker.data = hotelObjects[i].id;

            marker.on('click', onMarkerClick); //adding the event listener to all the markers


        }


    }

    $("#zoomOut").click(() => {
        //Setting the map to Canada
        map.flyTo([56.1304, -106.3468], 4);
    })
    //USER LOCATION ICON
    const userIcon = L.icon({
        iconUrl: 'images/icons/you-icon.png',
        iconSize:     [60, 60],
        iconAnchor:   [30, 60],
        popupAnchor:  [0, -65]
    });

    //Geolocation
    let findUserLocation = async () => {
        await map_position();
        showBadge();
        show_rooms(room_info);
        console.log(hotelObjects);

        navigator.geolocation.getCurrentPosition(position => {
            let mylat = position.coords.latitude;
            let mylong = position.coords.longitude;

             L.marker([mylat, mylong], {icon: userIcon}).addTo(map);


        })
    }

    findUserLocation();

//API WEATHER
    let API = "3d027c5beb1a4ef8ba5214946262903";
    let url = "https://api.weatherapi.com/v1/current.json";


//API WEATHER FUNCTION CALL
//Fetch current weather of the location clicked based on city of that hotel
    const weather_call = async (city) => {
        url = `https://api.weatherapi.com/v1/current.json?key=${API}&q=${city}`
        try{
            let response = await fetch(url);
            if(!response.ok){
                throw new Error('Weather API returned failed');
            }

            let weather_ofLocation = await response.json();
            console.log(weather_ofLocation);

            //destructure properties of current weather:
            const {temp_c, feelslike_c,condition} = weather_ofLocation.current;
            const{text, icon} = condition;

            const iconURL = `https:${icon}`;
            //puttin data fetched in HTML in hotel cards
            $("#weatherIcon").attr("src", iconURL);
            $("#weatherTemp").text(`${temp_c} °C`);
            $("#weatherCondition").text(text);
            $("#feelsLike").text(`Feels like ${feelslike_c} °C |`);


        }catch (error) {
            console.error("Could not load weather:", error.message);
            $("#weatherCondition").text("Weather Unavailable");
        }


    }

    let matchingRooms; //global so it can be seen when rendering cards
    //returns only rooms that match with the hotelId
    const hotels_with_rooms= (hotelId) => {
        //get the array of hotel that find
         matchingRooms = roomObjects.filter((room) => room.hotelId === hotelId);
        return matchingRooms;

    }

    //checking if the input of nights is being filled or not. only if filled you can book room
    $(document).on('input', '.inputNights', (e) => {

        console.log(e.target.id); //every input has the id of the same one as button so we can hide teh button
        console.log(e.target.value);
        //attached the roomId to the input id
        let roomId= parseInt(e.target.id);
        //finding if the room matches any of the cart array rooms
        let isBooked = room_info.some((bookedRoom) => bookedRoom.id === roomId);
        //if it is booked => leave button disabled and stop the fucntion
        if(isBooked){
            return
        }
        //activating the bookRoom only if there is input
        if (e.target.value === ""){
            $(`.bookRoom[data-index="${e.target.id}"]`).prop('disabled', true);
        }else{//the actual input of the nights 5 or 4
            $(`.bookRoom[data-index="${e.target.id}"]`).prop('disabled', false);
        }
    })

//Room cards for display after the hotel has been selected
    const room_cards = (matchingRooms, hotelName) => {
        //reset the html in case previous cards from different hotel are displayed
        $('#roomCards').html('');
        //loop through the matchingRooms(of that hotel) and get id,name,type,beds... so it can be displayed on card

        for (let i = 0; i < matchingRooms.length; i++) {
            const room = matchingRooms[i];
            const { id, name, type, beds, maxGuests, pricePerNight, image} = room;

            let inputViewClass = ""; //shows the input for nigths
            let soldOut = "d-none"; //message soldOut
            let colorBadge = "green-badge"; //color of badge
            let buttonHide = ""; //button to hide if soldout

            //hides button and book nights if its unavailable
            if (room.available === false) {
                inputViewClass = "d-none"; //no access to nights input
                soldOut = ""; //show soldout message
                colorBadge = "red-badge"; //change the color of unavailable
                buttonHide = "invisible"; //invisible so card mantains same height
            }

            // check if the room is already in the cart to change the default button text
            let isBooked = room_info.some((bookedRoom) => bookedRoom.id === id);
            let buttonText = "Book Room";
            if (isBooked) {
                buttonText = "Added to Cart";
            }


            $(`
            <div class="col-10 col-lg-4"> 
                <div class="card room_card h-100">
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill z-3 ${colorBadge}">
                            ${matchingRooms[i].availability()} 
                            <span class="visually-hidden">Availability</span>
                         </span>
                         
                         <div id="imageBoxRooms">          
                             <img src="${image}" class="card-img-top room-img" alt="Hotel Room" >                                               
                         </div>
                       
                        <div class="card-body regular-font">
                        
                            <h5 class="card-title roomName bold-font m-0">${name}</h5>
                            <p class="card-text roomType m-0" >${type} | ${beds}</p>
                            <p class="card-text guests m-0" >Max Guests: ${maxGuests}</p>
                            <p class="card-text cost m-0" ><strong>$${pricePerNight}/night</strong></p>
                           <div class="mt-auto pt-3">
                                <div class="d-flex flex-column justify-content-center mt-3 p-3" id="nights" style="min-height: 115px;">
                                    <div class="${inputViewClass}">
                                        <label class="mb-1 fw-bold" style="font-size: 0.9rem;">Length of Stay</label>
                                        <div class="input-group" >
                                            <input class="form-control inputNights fw-bold" id="${id}" type="number" name="nights" min="1" max="100" placeholder="0 nights">
                                        </div>
                                         <small class="helper-text mt-1 d-block fw-bold"><i class="bi bi-info-circle"></i> Enter nights to unlock booking</small>
                                    </div>
                                    <div class="${soldOut} text-center">
                                        <h5 class=" mt-1 red" ><i class="bi bi-info-circle"></i> Unavailability: Sold Out </h5>
                                    </div>
                                </div>    
                                <button type="button" class="btn btn-primary m-2 bookRoom ${buttonHide}" data-index="${id}" disabled  >${buttonText}</button>
                            </div>
                        </div>
                        <div class="card-footer text-center">
                            <small class="text-body-secondary hotelName "><i class="bi bi-geo"></i> ${hotelName}</small>
                        </div>
                </div> 
            </div>    
        `).hide().appendTo('#roomCards').fadeIn("slow", "linear");
            //effect to slowly make the cards fadeIn
        }
    }

//Booking a room Logic & Checkout cart

    //Function that stores room info in storage:  need the room (object), and the nights so you can add it to storage

    const roomAddToStorage = (room, nights) => {
        room.nights = nights; //storing nights to use for math later (collected from input)
        room.hotelName = hotelName(room.hotelId); //storing the hotelName using function with hotelID
        room.weather = $("#weatherCondition").text().toLowerCase(); //storing the weather for discounts
        window.room_info.push(room); //pushing new room into global array
        try{
            localStorage.setItem("roomBookedHistory", JSON.stringify(room_info));
            show_rooms(room_info);

        }catch (error){
            console.log("Your cart is too full");
            room_info.pop();
        }
    }

    const toast = $("#roomBookedNotification");

// Event Listener ( dynamic elements = they are not in HTML yet)
    $(document).on('click', '.bookRoom', function () {
        badge_add(); //update the badge

        //storing  index of the button(0,1,2) so array is accessed
        const id = parseInt(this.dataset.index);

        //access room in the array
        let selectedRoom = roomObjects.find((room) => room.id === id);

        //nights that inputted gets saved so can be accessed for math portion
        let nights = $(`#${id}`).val();

        //Add the room to local storage and show the toast for verification
        roomAddToStorage(selectedRoom, nights);
        toast.show();
        //Once room is booked, user cannot book the same type of room again until is paid for (easiest solution for  bug)
        $(this).prop('disabled', true);
        $(this).text("Added to Cart"); //added to cart (cannot add it again)

        setTimeout( () =>{ //timeout for toast to hide so it doesnt stay on screen
            toast.hide()
        }, 4000);

    })


// Event Listener ( dynamic elements) when elements dont exist yet
    $(document).on('click', '.deleteRoom', function () {

        //storing  index of the button(0,1,2) so array is accessed
        const id = this.dataset.index;

        const wasRemoved = roomRemoveFromStorage(id, room_info);

        // if the room was removed --> udpate badge and upodate storage
        if (wasRemoved) {
            badge_remove();
            //targetting the button of that individual room with the id of the number(set as data-index)
            $(`.bookRoom[data-index="${id}"]`).prop('disabled', false);
            $(`.bookRoom[data-index="${id}"]`).text("Book Room");

        } else {
            console.log("Could not find room with ID:", id, "in cart.");
        }


    })

    //Empty Cart
    $("#emptyCart").click(() => {
        //Remove from storage
        localStorage.removeItem("Items");
        localStorage.removeItem("roomBookedHistory");

        //empty the arrays of rooms, and the cartTotal to 0
        window.room_info = [];
        cartTotal = 0;

        //update bags and cart
        showBadge();
        show_rooms(room_info);
        //make all the buttons in the cards of rooms visible and functional
        $('.bookRoom').prop('disabled', false).text('Book Room');

        //reset subTotalCart
        $("#subTotalCart").html(`
            <h5 class="col-6 m-0">Cart Subtotal:</h5>
            <h5 class="col-6 m-0 text-end fw-bold">$0.00</h5>
        `)
    });
    //Filter price, event listener on values => using change not click
    $(document).on('change', '#priceFilter', (e) => {
        //get rooms for current hotel on display
        let roomList = hotels_with_rooms(currentHotelId);

        //get the value that is being clicked
        let sortChoice = $(e.target).val();

        if (sortChoice == "lowToHigh") {
            //smallest to biggest
            roomList.sort((a, b) => a.pricePerNight - b.pricePerNight);

        } else if (sortChoice == "highToLow") {
            //biggest to smallest
            roomList.sort((a, b) => b.pricePerNight - a.pricePerNight);
        }
        //get the active hotel name to passinto room_cards to remake the cards once they are filtered

        let activeHotelName = hotelName(currentHotelId);
        //re-render cards
        room_cards(roomList, activeHotelName);
    })
    //Quote effect: transition to fade in, needs to be hidden first, 12000 == 1.2 seconds to complete
    $("#revealText").hide().fadeIn(1400);

});






