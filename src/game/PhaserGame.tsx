import { onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import StartGame from './main';
import { EventBus } from './EventBus';

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
    ref?: (instance: IRefPhaserGame) => void; // Optional ref callback prop
}

export const PhaserGame = (props: IProps) => {

    let gameContainer: HTMLDivElement | undefined;
    const [instance, setInstance] = createStore<IRefPhaserGame>({ game: null, scene: null });

    onMount(() => {
        const gameInstance = StartGame("game-container");
        setInstance("game", gameInstance);

        if (props.ref)
        {
            props.ref({ game: gameInstance, scene: null });
        }

        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {

            if (props.currentActiveScene)
            {
                props.currentActiveScene(scene_instance);
                setInstance("scene", scene_instance);

            }

            if (props.ref)
            {
                props.ref({ game: gameInstance, scene: scene_instance });
            }

        });

        onCleanup(() => {

            if (instance.game)
            {
                instance.game.destroy(true);
                setInstance({ game: null, scene: null });
            }
            
            EventBus.removeListener('current-scene-ready');
            
        });
    });

    return (
        <div id="game-container" ref={gameContainer}></div>
    );
};