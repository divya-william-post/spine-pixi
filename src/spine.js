/* eslint-disable */
// import * as PIXI from 'pixi.js'

export async function initSpine () {
    var app = new PIXI.Application();
    await app.init({
        width: 900,
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
    PIXI.Assets.add({alias: "sky", src: "./sky.png" });
    PIXI.Assets.add({alias: "background", src: './starsky.jpg' });
    PIXI.Assets.add({alias: "midground", src: './midground.png' });
    PIXI.Assets.add({alias: "platform", src: './platform.png' });
   
    await PIXI.Assets.load(["platform", "spineboyData", "spineboyAtlas", "sky", "background", "midground"]);

    const sky = PIXI.Sprite.from('background');
    sky.width = app.screen.width;
    sky.height = app.screen.height;
    app.stage.addChild(sky);

    const platform = PIXI.Sprite.from('platform');
    platform.y = 580;
    platform.width =  app.screen.width;
    platform.height = 250;
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

    // Add the display object to the stage.
    // app.stage.addChild(spineboy);
    app.stage.hitArea = new PIXI.Rectangle(0, 0, app.view.width, app.view.height);

    // Make the stage interactive and register pointer events
    app.stage.eventMode = "dynamic";
    let isDragging = false;
    const bones = spineboy.skeleton.bones;
  
    // Set looping animations "idle" on track 0 and "aim" on track 1.
    spineboy.state.setAnimation(0, "idle", true);

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
      //default state with hoverboard animation
      spineboy.state.setAnimation(0, "hoverboard", true, 0);

      if (key.code === "ArrowLeft" || key.code === "KeyA") {
        // turn spine boy to the left with 'Arrow LEFT Key'
        spineboy.skeleton.scaleX = -1;
      } else if (key.code === "ArrowRight" || key.code === "KeyD") {
        // turn spine boy to the right with 'Arrow RIGHT Key'
        spineboy.skeleton.scaleX = 1;
      } else if ((key.code === "ArrowUp" || key.code === "KeyW")) {
        // make the spine boy jump once with 'Arrow UP Key'
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

    function run(){
      spineboy.state.setAnimation(0, "run", true);
    }
    function shoot(){
      spineboy.state.setAnimation(0, "shoot", true);
    }
    function jump(){
      spineboy.state.setAnimation(0, "jump", true);
    }
    function hoverboard(){
      spineboy.state.setAnimation(0, "hoverboard", true);
    }
    function portal(){
      spineboy.state.setAnimation(0, "portal", true);
    }
    function turnLeft(){
      spineboy.skeleton.scaleX = -1;
    }
    function turnRight(){
      spineboy.skeleton.scaleX = 1;
    }
    function walk(){
      spineboy.state.setAnimation(0, "walk", true);
    }
    function stop(){
      spineboy.state.setAnimation(0, "idle", true);
    }
    return {stop, portal, run, shoot, jump, hoverboard, walk, turnLeft, turnRight}
}
