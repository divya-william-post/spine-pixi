/* eslint-disable */
export async function initSpine () {
    var app = new PIXI.Application();
    await app.init({
        width: 1200,
        height: 700,
        resolution: 1,
        autoDensity: true,
        resizeTo: window,
        backgroundColor: 0x2c3e50,
    })
    document.body.appendChild(app.view);

    // Pre-load the skeleton data and atlas. You can also load .json skeleton data.
    PIXI.Assets.add({alias: "spineboyData", src: "./spineboy-pro.skel" });
    PIXI.Assets.add({alias: "spineboyAtlas", src: "./spineboy-pma.atlas" });
    PIXI.Assets.add({alias: "sky", src: "https://pixijs.com/assets/tutorials/spineboy-adventure/sky.png" });
    PIXI.Assets.add({alias: "background", src: './starsky.jpg' });
    PIXI.Assets.add({alias: "midground", src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/midground.png' });
    PIXI.Assets.add({alias: "platform", src: './platform.png' });

   
    await PIXI.Assets.load(["platform", "spineboyData", "spineboyAtlas", "sky", "background", "midground"]);

    const sky = PIXI.Sprite.from('background');
    sky.width = app.screen.width;
    sky.height = app.screen.height;
    app.stage.addChild(sky);

    // const midground = PIXI.Sprite.from('midground');
    // midground.width =  app.screen.width;
    // midground.height = app.screen.height;
    // app.stage.addChild(midground);

    const platform = PIXI.Sprite.from('platform');
    platform.y = 580;
    platform.width =  app.screen.width;
    platform.height = 150;
    app.stage.addChild(platform);


    // Create the spine display object
    const spineboy = spine.Spine.from({skeleton: "spineboyData", atlas: "spineboyAtlas", 
        scale: 0.3,
    });

    // Set the default mix time to use when transitioning
    // from one animation to another.
    spineboy.state.data.defaultMix = 0.2;

    // Center the Spine object on screen.
    spineboy.x = window.innerWidth / 2;
    spineboy.y = 590;

    // Set looping animations "idle" on track 0 and "aim" on track 1.
    spineboy.state.setAnimation(1, "aim", true);

    // Add the display object to the stage.
    // app.stage.addChild(spineboy);
    app.stage.hitArea = new PIXI.Rectangle(0, 0, app.view.width, app.view.height);

    // Make the stage interactive and register pointer events
    app.stage.eventMode = "dynamic";
    let isDragging = false;
    const bones = spineboy.skeleton.bones;
  
// Set looping animations "idle" on track 0 and "aim" on track 1.
spineboy.state.setAnimation(0, "idle", true);
spineboy.state.setAnimation(1, "aim", true);

// Add the display object to the stage.
app.stage.addChild(spineboy);
app.stage.hitArea = new PIXI.Rectangle(0, 0, app.view.width, app.view.height);

// Make the stage interactive and register pointer events
app.stage.eventMode = "dynamic";

app.stage.on("pointerdown", (e) => {
    isDragging = true;
    setBonePosition(e);
    spineboy.state.setAnimation(0, "shoot", false);
});

app.stage.on("globalpointermove", (e) => {
    if (isDragging) setBonePosition(e);
    spineboy.state.setAnimation(1, "aim", true);
});

app.stage.on("pointerup", (e) => (isDragging = false));

const setBonePosition = (e) => {
    // Transform the mouse/touch coordinates to Spineboy's coordinate
    // system origin. `position` is then relative to Spineboy's root
    // bone.
    const position = new spine.Vector2(
        e.data.global.x - spineboy.x,
        e.data.global.y - spineboy.y
    );

    // Find the crosshair bone.
    const crosshairBone = spineboy.skeleton.findBone("crosshair");

    // Take the mouse position, which is relative to the root bone,
    // and transform it to the crosshair bone's parent root bone
    // coordinate system via `worldToLocal()`. `position` is relative
    // to the crosshair bone's parent bone after this
    crosshairBone.parent.worldToLocal(position);

    // Set the crosshair bone's position to the mouse position
    crosshairBone.x = position.x;
    crosshairBone.y = position.y;
};


      // wait a frame as pixi bounds do not work until rendered
      await new Promise((resolve) => requestAnimationFrame(resolve));
 // Add variables for movement, speed.
 let moveLeft = false;
 let moveRight = false;
 const speed = 5;


      // Handle the case that the keyboard keys specified below are pressed.
      function onKeyDown(key) {
        spineboy.state.setAnimation(0, "hoverboard", true, 0);
        if (key.code === "ArrowLeft" || key.code === "KeyA") {
          moveLeft = true;
          spineboy.skeleton.scaleX = -1;
        } else if (key.code === "ArrowRight" || key.code === "KeyD") {
          moveRight = true;
          spineboy.skeleton.scaleX = 1;
        } else if ((key.code === "ArrowUp" || key.code === "KeyW")) {
            spineboy.state.setAnimation(0, "jump", false); 
        }
      }

      // Handle when the keys are released, if they were pressed.
      function onKeyUp(key) {
        if (key.code === "ArrowLeft" || key.code === "KeyA") {
          moveLeft = false;
        } else if (key.code === "ArrowRight" || key.code === "KeyD") {
          moveRight = false;
        } else if ((key.code === "ArrowUp" || key.code === "KeyW")) {
            spineboy.state.setAnimation(0, "walk", true); // Optional: set jump animation
        }
      }

      // Add event listeners so that the window will correctly handle input.
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      // Update the application to move Spineboy if input is detected.
      app.ticker.add(() => {
        if (moveLeft) {
          spineboy.x -= speed;
        }
        if (moveRight) {
          spineboy.x += speed;
        }
      });





      //time for sack
       // Pre-load the skeleton data and atlas. You can also load .json skeleton data.
    PIXI.Assets.add({alias: "sackData", src: "./cloud-pot.skel"});
    PIXI.Assets.add({alias: "sackAtlas", src: "./cloud-pot-pma.atlas"});
    await PIXI.Assets.load(["sackData", "sackAtlas"]);

    // Create the spine display object
    const sack = spine.Spine.from({skeleton: "sackData", atlas: "sackAtlas", 
      scale: 0.1,
    });

    // Center the spine object on screen.
    sack.x = window.innerWidth / 2;
    sack.y = window.innerHeight / 2 + sack.getBounds().height / 2;

    // Set animation "cape-follow-example" on track 0, looped.
    sack.state.setAnimation(0, "pot-moving-followed-by-rain", true);
    // Add the display object to the stage.
    app.stage.addChild(sack);


    setInterval(jumpSack, 1000);

    // Function to randomly jump the sack within the visible screen
// Function to randomly jump the sack within the visible screen
function jumpSack() {
    const jumpDistance = 200; // Define a distance to consider for collision check
    let newX, newY;
    let tooClose = true;

    // Get the screen's width and height dynamically for responsiveness
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Define padding so the sack doesn't jump too close to the edges
    const padding = 50; // Reduced padding to allow more free movement

    // Keep generating new positions until a valid one is found
    while (tooClose) {
        // Randomly generate X and Y positions within the screen size, factoring in padding
        newX = Math.random() * (screenWidth - padding * 2) + padding;  // Random X within screen bounds
        newY = Math.random() * (screenHeight - padding * 2) + padding; // Random Y within screen bounds

        // Calculate distance from the spineboy
        const distanceX = newX - spineboy.x;
        const distanceY = newY - spineboy.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Check if the new position is too close to the spineboy
        if (distance > jumpDistance) {
            tooClose = false; // Valid position found
        }
    }

    // Update sack's position to the new random position
    sack.x = newX;
    sack.y = newY;
}


}
