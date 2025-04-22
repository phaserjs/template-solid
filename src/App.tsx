import { createSignal } from 'solid-js';
import type { IRefPhaserGame } from './PhaserGame';
import { PhaserGame } from './PhaserGame';
import Phaser from 'phaser';
import { MainMenu } from './game/scenes/MainMenu';

const App = () => {
    
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = createSignal(true);

    // References to the PhaserGame component (game and scene are exposed)
    let phaserRef: IRefPhaserGame;
    const [spritePosition, setSpritePosition] = createSignal({ x: 0, y: 0 });

    const changeScene = () => {

        const scene = phaserRef.scene as MainMenu;

        if (scene)
        {
            scene.changeScene();
        }

    }

    const moveSprite = () => {

        const scene = phaserRef.scene as MainMenu;

        if (scene)
        {
            if (scene.scene.key === 'MainMenu')
            {
                // Get the update logo position
                scene.moveLogo(({ x, y }) => {

                    setSpritePosition({ x, y });

                });
            }
        }
    }

    const addSprite = () => {

        const scene = phaserRef.scene;

        if (scene)
        {
            // Add more stars
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);

            //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
            const star = scene.add.sprite(x, y, 'star');

            //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
            //  You could, of course, do this from within the Phaser Scene code, but this is just an example
            //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
            scene.add.tween({
                targets: star,
                duration: 500 + Math.random() * 1000,
                alpha: 0,
                yoyo: true,
                repeat: -1
            });
        }

    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {

        setCanMoveSprite(scene.scene.key !== 'MainMenu');

    };

    return (
        <div id="app">
            <PhaserGame ref={(el: IRefPhaserGame) => phaserRef = el} currentActiveScene={currentScene} />
            <div>
                <div>
                    <button class="button" onClick={changeScene}>Change Scene</button>
                </div>
                <div>
                    <button disabled={canMoveSprite()} class="button" onClick={moveSprite}>Toggle Movement</button>
                </div>
                <div class="spritePosition">Sprite Position:
                    <pre>{`{\n  x: ${spritePosition().x}\n  y: ${spritePosition().y}\n}`}</pre>
                </div>
                <button class="button" onClick={addSprite}>Add New Sprite</button>
            </div>
        </div>
    );
};

export default App;
