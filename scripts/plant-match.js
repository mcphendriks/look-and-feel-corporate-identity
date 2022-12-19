class Card {
    constructor({
        imageUrl,
        onDismiss,
        onLike,
        onDislike
    }) {
        this.imageUrl = imageUrl;
        this.onDismiss = onDismiss;
        this.onLike = onLike;
        this.onDislike = onDislike;
        this.#init();
    }

    // private properties
    #startPoint;
    #offsetX;
    #offsetY;

    // CHECKS IF THE DEVICE IS TOUCH SCREEN
    #isTouchDevice = () => {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    // INITIAL STATE
    #init = () => {
        const card = document.createElement('div'); // CREATE A DIV ELEMENT
        card.classList.add('card'); // ADD A CARD CLASS NAME
        const img = document.createElement('img'); // CREATE IMAGE ELEMENT
        img.src = this.imageUrl; // SET THE SOURCE TO BE THE PASSED ARGUMENTS
        card.append(img); // APPEND THE IMAGE TO THE CARD ELEMENT
        this.element = card; // SET THIS INSTANCE OF THE CARD TO BE THE NEWLY CREATED CARD

        // CHECK IF THE DEVICE IS TOUCH SCREEN OR NOT, AND LISTEN TO EVENTS ACCORDINGLY
        if (this.#isTouchDevice()) {
            this.#listenToTouchEvents();
        } else {
            this.#listenToMouseEvents();
        }
    }

    // TOUCH EVENT LISTENER. THIS WILL BE TRIGGERED EVERY TIME THE CARDS ARE TOUCHED 
    #listenToTouchEvents = () => {
        this.element.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0]; // GET THE CHANGED TOUCHED OBJECT. IT CONTAINS THE POSITION OF X AND Y OF WHERE THE CARDS IS TOUCHED. YOU CAN CONSOLE LOG THIS TO SEE THE OBJECT YOURSELF
            if (!touch) return; // RETURN IF NULL
            const { clientX, clientY } = touch; // DESTRUCTURE THE CLIENT X AND Y FROM THE TOUCH OBJECT
            this.#startPoint = { x: clientX, y: clientY } // SET THOSE TOUCH POSITIONS TO BE THE STARTING POINT OF THE DRAG
            document.addEventListener('touchmove', this.#handleTouchMove); // LISTEN TO MOVE EVENTS WHILE BEING TOUCHED. PUT IT SIMPLY, THIS IS DRAGGING THE CARDS
            this.element.style.transition = 'transform 0s';
        });

        document.addEventListener('touchend', this.#handleTouchEnd); // LISTEN WHEN THE TOUCH HAS ENDED
        document.addEventListener('cancel', this.#handleTouchEnd); // LISTEN WHEN THE TOUCH IS CANCELLED
    }

    // MOUSE EVENT LISTENER. THIS WILL BE TRIGGERED EVERY TIME THERE'S A MOUSE EVENT DONE ON THE CARDS
    #listenToMouseEvents = () => {
        this.element.addEventListener('mousedown', (e) => {
            const { clientX, clientY } = e; // GET THE POSITION OF THE X AND Y OF WHERE IT IS CLICKED
            this.#startPoint = { x: clientX, y: clientY } // SET THOSE POSITIONS AS THE STARTING POINT OF THE DRAG
            document.addEventListener('mousemove', this.#handleMouseMove); // LISTEN TO MOVE EVENTS WHILE BEING CLICKED. PUT IT SIMPLY, THIS IS DRAGGING THE CARDS
            this.element.style.transition = 'transform 0s';
        });

        document.addEventListener('mouseup', this.#handleMoveUp);

        // PREVENT THE DRAG EVENT AS WE ALREADY SIMULATE THAT WITH THE COMBINATION OF MOUSE DOWN AND MOUSE MOVE EVENTS
        this.element.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }

    // MOVE HANDLE. THIS WILL BE CALLED EVER TIME THE MOUSE IS MOVED WHILE THE CARDS ARE CLICKED. SIMPLY PUT, WHEN YOU'RE DRAGGING THE CARDS
    #handleMove = (x, y) => {
        this.#offsetX = x - this.#startPoint.x;  // SET THE POSITION X OF THE CARD TO BE WHERE THE MOUSE CURSOR IS
        this.#offsetY = y - this.#startPoint.y;  // SET THE POSITION Y OF THE CARD TO BE WHERE THE MOUSE CURSOR IS
        const rotate = this.#offsetX * 0.1; // ADD A SLIGHT ROTATION TO THE SIMULATED DRAG
        this.element.style.transform = `translate(${this.#offsetX}px, ${this.#offsetY}px) rotate(${rotate}deg)`; // APPLY THE NEW POSITIONS
        // DISMISS THE CARD WHEN IT GOES TOO FAR FROM THE ORIGIN
        if (Math.abs(this.#offsetX) > this.element.clientWidth * 0.7) {
            this.#dismiss(this.#offsetX > 0 ? 1 : -1);
        }
    }

    // WILL BE TRIGGERED EVERY MOUSE MOVE WHEN THE CARD IS CLICKED. SIMPLY PUT, WHEN DRAGGING 
    #handleMouseMove = (e) => {
        e.preventDefault();
        if (!this.#startPoint) return; // SIMPLY RETURN IF THE STARTING POINT IS NULL, OR IS NOT BEING SET YET
        const { clientX, clientY } = e; // DESTRUCTURE THE X AND Y POSITIONS FROM THE EVENT
        this.#handleMove(clientX, clientY); // PASS THOSE POSITIONS TO THE HANDLE MOVE TO BE PROCESSED
    }

    // TRIGGERED WHEN THE MOUSE IS UP AND THE CARD IS GOES FROM THE STATE OF BEING CLICKED TO UNCLICK
    #handleMoveUp = () => {
        this.#startPoint = null; // SET THE STARTING POINT BACK TO NULL
        document.removeEventListener('mousemove', this.#handleMouseMove); // CLEANUP AND REMOVE THE LISTENER
        this.element.style.transform = ''; // TRANSFORM IT BACK TO THE ORIGIN
    }

    // TRIGGER WHEN THE CARDS IS TOUCHED AND MOVED. SIMPLY PUT, DRAGGED
    #handleTouchMove = (e) => {
        if (!this.#startPoint) return; // SEE IF THE STARTING POINT IS NULL. OTHERWISE, JUST RETURN
        const touch = e.changedTouches[0]; // GET THE CHANGED TOUCHED OBJECT. IT CONTAINS THE POSITION OF X AND Y OF WHERE THE CARDS IS TOUCHED
        if (!touch) return; // RETURN IF NULL
        const { clientX, clientY } = touch; // DESTRUCTURE THE X AND Y POSITIONS
        this.#handleMove(clientX, clientY); // PASS THOSE POSITIONS TO THE HANDLE MOVE TO BE PROCESSED
    }

    // TRIGGER WHEN YOU LET GO OF THE TOUCH
    #handleTouchEnd = () => {
        this.#startPoint = null; // SET THE STARTING POINT BACK TO NULL
        document.removeEventListener('touchmove', this.#handleTouchMove); // CLEANUP AND REMOVE THE LISTENER
        this.element.style.transform = ''; // SET THE CARDS BACK TO THE ORIGIN
    }

    // TRIGGER WHEN THE CARDS ARE DISMISSED FROM EITHER LEFT OR RIGHT
    #dismiss = (direction) => {
        this.#startPoint = null; // SET THE STARTING POINT BACK TO NULL

        // LISTENER CLEANUP
        document.removeEventListener('mouseup', this.#handleMoveUp);
        document.removeEventListener('mousemove', this.#handleMouseMove);
        document.removeEventListener('touchend', this.#handleTouchEnd);
        document.removeEventListener('touchmove', this.#handleTouchMove);

        this.element.style.transition = 'transform 1s'; // SET THE TRANSITION FOR THE CARD DISMISSAL ANIMATION
        this.element.style.transform = `translate(${direction * window.innerWidth}px, ${this.#offsetY}px) rotate(${90 * direction}deg)`; // SET THE TRANSFORMATION ANIMATION WHEN THE CARD IS BEING DISMISSED
        this.element.classList.add('dismissing'); // ADD A CLASS NAMER OF DISMISSING FOR IT TO GE TRACKED

        // SET THE DISMISSAL TIMEOUT
        setTimeout(() => {
            this.element.remove();
        }, 1000);
        
        // INVOKE FUNCTIONS DEPENDING ON THE DISMISSAL DIRECTION. WHEN THE DIRECTION IS 1, OR DISMISSED TO RIGHT, THEN IT WILL RUN THE ONLIKE FUNCTION. OTHERWISE RUN THE ONDISLIKE
        if (typeof this.onDismiss === 'function') {
            this.onDismiss();
        }
        if (typeof this.onLike === 'function' && direction === 1) {
            this.onLike();
        }
        if (typeof this.onDislike === 'function' && direction === -1) {
            this.onDislike();
        }
    }
}

// DOM <!--responsible for the functionalitys off the container swiper and like and dislike button -->
const swiper = document.querySelector('#swiper');
const like = document.querySelector('#like');
const dislike = document.querySelector('#dislike');


// IMAGES
const urls = [
  'https://plnts.com/_next/image?url=https%3A%2F%2Fwebshop.plnts.com%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2Faa5d334f459227518b6c3cf7ea9d29ed%2Fp%2Fl%2Fpl.xl.005-2.jpg&w=750&q=100',
  'https://www.plantje.nl/wp-content/uploads/2019/01/Schefflera-op-lava-steen-plantje-1024-600x600.jpg.webp',
  'https://www.plantje.nl/wp-content/uploads/2022/05/phlebodium-aureum-P17-1024-1-600x600.jpg.webp',
  'https://www.plantje.nl/wp-content/uploads/2021/09/Aeschynanthus-Japhrolepis-Lifestyle-600x600.jpg.webp',
  'https://www.plantje.nl/wp-content/uploads/2021/09/Spathiphyllum-Torelli-p12-1-600x600.jpg.webp',
  'https://www.plantje.nl/wp-content/uploads/2022/10/Parthenocissus-Striata-Suikerdruifje-P12-1024-1-600x600.webp'
];

const scale = [
  1, 1.08, 1.13, 1.18, 1.23, 1.28, 1.33
]

// VARIABLE TO TRACK THE COUNT OF CARDS
let cardCount = 0;

// FUNCTION TO APPEND A CARD
const appendNewCard = () => {
  //create an object with the use of the new keyword
  const card = new Card({
    imageUrl: urls[cardCount % urls.length], //Haalt alle opjecten uit de bovenstaande array ALSO NECESSARY FOR IMAGE LOOPING
    onDismiss: appendNewCard,
    onLike: () => {
      like.style.animationPlayState = 'running';
      like.classList.toggle('trigger');
    },
    onDislike: () => {
      dislike.style.animationPlayState = 'running';
      dislike.classList.toggle('trigger');
    }
  });
  swiper.append(card.element);
  cardCount++;

  // SELECT ALL THE CARDS THAT ARE NOT DISMISSED
  const cards = swiper.querySelectorAll('.card:not(.dismissing)');
  cards.forEach((card, index) => {
    // ADD A NEW PROPERTY RESPONSIBLE FOR THE TILT
    card.style.setProperty('--i', index);
    card.style.setProperty('--scale',scale[index])
  });
}

// APPEND THE CARDS
for (let i = 0; i < urls.length; i++) {
  appendNewCard();
}
