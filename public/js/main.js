/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

window.onload = () => {
  const scene = new Scene();
  this.scene = scene;

  // Set Google Assistant Canvas Action at scene level
  this.action = new Action(scene);
  // Call setCallbacks to register interactive canvas
  this.action.setCallbacks();
}

/**
 * Represent Triangle scene
 */
class Scene {
  constructor() {
    const view = document.getElementById('view');

    // set up fps monitoring
    const stats = new Stats();
    view.getElementsByClassName('stats')[0].appendChild(stats.domElement);

    // initialize rendering and set correct sizing
    const ratio = window.devicePixelRatio;
    const renderer = PIXI.autoDetectRenderer({
      transparent: true,
      antialias: true,
      resolution: ratio,
      width: view.clientWidth,
      height: view.clientHeight,
    });
    const element = renderer.view;
    element.style.width = `${renderer.width / ratio}px`;
    element.style.height = `${renderer.height / ratio}px`;
    view.appendChild(element);

    // center stage and normalize scaling for all resolutions
    const stage = new PIXI.Container();
    stage.position.set(view.clientWidth / 2, view.clientHeight / 2);
    stage.scale.set(Math.max(renderer.width, renderer.height) / 1024);

    // load a sprite from a svg file
    const sprite = PIXI.Sprite.from('triangle.svg');
    this.sprite = sprite;
    sprite.anchor.set(0.5);
    sprite.tint = 0x00FF00; // green
    sprite.spin = true;
    stage.addChild(sprite);

    // toggle spin on touch events of the triangle
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.on('pointerdown', () => {
      sprite.spin = !sprite.spin;
    });

    let last = performance.now();
    // frame-by-frame animation function
    const frame = () => {
      stats.begin();

      // calculate time differences for smooth animations
      const now = performance.now();
      const delta = now - last;

      // rotate the triangle only if spin is true
      if (sprite.spin) {
        sprite.rotation += delta / 1000;
      }

      last = now;

      renderer.render(stage);
      stats.end();
      requestAnimationFrame(frame);
    };
    frame();
  }
}