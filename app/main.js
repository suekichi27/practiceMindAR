import { CSS3DObject } from '../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import {loadGLTF, loadTextures, loadVideo} from '../libs/loader.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {

    // initialize MindAR 
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../assets/targets/target.mind',
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const [
      cardTexture,
      emailTexture,
      locationTexture,
      phoneTexture,
      profileTexture,
      leftTexture,
      rightTexture,
      pictureItem0Texture,
      pictureItem1Texture,
      pictureItem2Texture,
    ] = await loadTextures([
      '../assets/targets/card.png',
      '../assets/icons/email.png',
      '../assets/icons/location.png',
      '../assets/icons/phone.png',
      '../assets/icons/profile.png',
      '../assets/icons/left.png',
      '../assets/icons/right.png',
      '../assets/pictures/video-preview.png',
      '../assets/pictures/picture0.png',
      '../assets/pictures/picture1.png',
    ]);

    const planeGeometry = new THREE.PlaneGeometry(1, 0.552);
    const cardMaterial = new THREE.MeshBasicMaterial({map: cardTexture});
    const card = new THREE.Mesh(planeGeometry, cardMaterial);

    const iconGeometry = new THREE.CircleGeometry(0.075, 32);
    const emailMaterial = new THREE.MeshBasicMaterial({map: emailTexture});
    const phoneMaterial = new THREE.MeshBasicMaterial({map: phoneTexture});
    const profileMaterial = new THREE.MeshBasicMaterial({map: profileTexture});
    const locationMaterial = new THREE.MeshBasicMaterial({map: locationTexture});
    const leftMaterial = new THREE.MeshBasicMaterial({map: leftTexture});
    const rightMaterial = new THREE.MeshBasicMaterial({map: rightTexture});
    const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);
    const phoneIcon = new THREE.Mesh(iconGeometry, phoneMaterial);
    const profileIcon = new THREE.Mesh(iconGeometry, profileMaterial);
    const locationIcon = new THREE.Mesh(iconGeometry, locationMaterial);
    const leftIcon = new THREE.Mesh(iconGeometry, leftMaterial);
    const rightIcon = new THREE.Mesh(iconGeometry, rightMaterial);

    const pictureItem0Video = await loadVideo("../assets/video/video.mp4");
    pictureItem0Video.muted = true;
    const pictureItem0VideoTexture = new THREE.VideoTexture(pictureItem0Video);
    const pictureItem0VideoMaterial = new THREE.MeshBasicMaterial({map: pictureItem0VideoTexture});
    const pictureItem0Material = new THREE.MeshBasicMaterial({map: pictureItem0Texture});
    const pictureItem1Material = new THREE.MeshBasicMaterial({map: pictureItem1Texture});
    const pictureItem2Material = new THREE.MeshBasicMaterial({map: pictureItem2Texture});

    const pictureItem0V = new THREE.Mesh(planeGeometry, pictureItem0VideoMaterial); 
    const pictureItem0 = new THREE.Mesh(planeGeometry, pictureItem0Material); 
    const pictureItem1 = new THREE.Mesh(planeGeometry, pictureItem1Material); 
    const pictureItem2 = new THREE.Mesh(planeGeometry, pictureItem2Material); 

    profileIcon.position.set(-0.42, -0.5, 0);
    phoneIcon.position.set(-0.14, -0.5, 0);
    emailIcon.position.set(0.14, -0.5, 0);
    locationIcon.position.set(0.42, -0.5, 0);

    const pictureGroup = new THREE.Group();
    pictureGroup.position.set(0, 0, -0.01);
    pictureGroup.position.set(0, 0.6, -0.01);

    pictureGroup.add(pictureItem0);
    pictureGroup.add(leftIcon);
    pictureGroup.add(rightIcon);
    leftIcon.position.set(-0.7, 0, 0);
    rightIcon.position.set(0.7, 0, 0);

    const model = await loadGLTF('../assets/models/scene.gltf');
    model.scene.scale.set(0.5, 0.5, 0.5);
    model.scene.rotation.set(Math.PI/2, Math.PI/2, 0);
    model.scene.position.set(-0.067, -1.15, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(model.scene);
    anchor.group.add(card);
    anchor.group.add(emailIcon);
    anchor.group.add(phoneIcon);
    anchor.group.add(profileIcon);
    anchor.group.add(locationIcon);
    anchor.group.add(pictureGroup);

    const textElement = document.createElement("div");
    const textObj = new CSS3DObject(textElement);
    textObj.position.set(0, -1000, 0);
    textObj.visible = false;
    textElement.style.background = "#FFFFFF";
    textElement.style.padding = "30px";
    textElement.style.fontSize = "60px";

    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(textObj);

    // handle buttons
    leftIcon.userData.clickable = true;
    rightIcon.userData.clickable = true;
    emailIcon.userData.clickable = true;
    phoneIcon.userData.clickable = true;
    profileIcon.userData.clickable = true;
    locationIcon.userData.clickable = true;
    pictureItem0.userData.clickable = true;
    pictureItem0V.userData.clickable = true;

    const pictureItems = [pictureItem0, pictureItem1, pictureItem2]; 
    let currentPicture = 0;

    document.body.addEventListener('click', (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      const mouse = new THREE.Vector2(mouseX, mouseY);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
	let o = intersects[0].object; 
	while (o.parent && !o.userData.clickable) {
	  o = o.parent;
	}
	if (o.userData.clickable) {
	  if (o === leftIcon || o === rightIcon) {
	    if (o === leftIcon) {
	      currentPicture = (currentPicture - 1 + pictureItems.length) % pictureItems.length;
	    } else {
	      currentPicture = (currentPicture + 1) % pictureItems.length;
	    }
	    pictureItem0Video.pause();
	    for (let i = 0; i < pictureItems.length; i++) {
	      pictureGroup.remove(pictureItems[i]);
	    }
	    pictureGroup.add(pictureItems[currentPicture]);
	  } else if (o === pictureItem0) {
	    pictureGroup.remove(pictureItem0);
	    pictureGroup.add(pictureItem0V);
	    pictureItems[0] = pictureItem0V;
	    pictureItem0Video.play();
	  } else if (o === pictureItem0V) {
	    if (pictureItem0Video.paused) {
	      pictureItem0Video.play();
	    } else {
	      pictureItem0Video.pause();
	    }
	  } else if (o === phoneIcon) {
	    textObj.visible = true;
	    textElement.innerHTML = "+7(950)358-24-33";
	  } else if (o === emailIcon) {
	    textObj.visible = true;
	    textElement.innerHTML = "nebulae9001 [at] gmail";
	  } else if (o === profileIcon) {
	    textObj.visible = true;
	    textElement.innerHTML = "https://github.com/suekichi27";
	  } else if (o === locationIcon) {
	    textObj.visible = true;
	    textElement.innerHTML = "Nizhny Novgorod, Russia";
	  }
	}
      }
    });

    const clock = new THREE.Clock();
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const elapsed = clock.getElapsedTime();
      const iconScale = 1 + 0.2 * Math.sin(elapsed*5);
      [phoneIcon, emailIcon, profileIcon, locationIcon].forEach((icon) => {
	icon.scale.set(iconScale, iconScale, iconScale);
      });

      const modelZ = Math.min(0.3, -0.3 + elapsed * 0.5);
      model.scene.position.set(0, -0.25, modelZ);

      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    });
  }
  start();
});
