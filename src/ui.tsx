import {
    engine, InputAction, inputSystem, PointerEventType,
    Transform,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}
const BLACK_OPACITY_1 =Color4.create(0,0,0,0.5)
const MAX_BUFFER_SIZE = 50

const state:any = {
    keyBuffer:[],
    mouseBuffer:[]
}

/*
engine.addSystem(simulatePerformanceDrawback)
function simulatePerformanceDrawback(){
    const start = Date.now()
    while (Date.now() < start + 300) {}
}
*/

engine.addSystem(() => {
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
        state.keyBuffer.push("DOWN")
        while(state.keyBuffer.length > MAX_BUFFER_SIZE){
            state.keyBuffer.shift()
        }
    }else if(inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_UP)) {
        state.keyBuffer.push("UP")
        while(state.keyBuffer.length > MAX_BUFFER_SIZE){
            state.keyBuffer.shift()
        }
    }

})

function getStreamText(stream:string[]){
    return stream.join('\n')
}

const uiComponent = () => (
    [<UiEntity uiTransform={{
        positionType:"absolute",
        position:{top:"10%", left:"20%"}
    }} uiText={{value:"For left logs press E, for right logs, move mouse around it"}} />,<UiEntity uiTransform={{
        width:"100%",
        height:"100%",
        positionType:"absolute",
        position:{top:0, left:0},
        flexDirection:"row"
    }}
    >
        <UiEntity uiTransform={{
            width:"35%",
            height:"60%",
            position:{left:"15%", top:"15%"}
        }}
        uiBackground={{
            color:BLACK_OPACITY_1
        }}
                  uiText={{value:state.keyBuffer.join("\n")}}
        >

        </UiEntity>
        <UiEntity uiTransform={{
            width:"35%",
            height:"60%",
            position:{left:"16%", top:"15%"}
        }}

                  uiText={{value:state.mouseBuffer.join("\n")}}
                  uiBackground={{
                      color:BLACK_OPACITY_1
                  }}
                  onMouseEnter={()=>{
                      state.mouseBuffer.push("ENTER")
                      while(state.mouseBuffer.length > MAX_BUFFER_SIZE){
                          state.keyBuffer.shift()
                      }
                  }}
                  onMouseLeave={()=>{
                      state.mouseBuffer.push("EXIT")
                      while(state.mouseBuffer.length > MAX_BUFFER_SIZE){
                          state.keyBuffer.shift()
                      }
                  }}
        >

        </UiEntity>
    </UiEntity>]
)

function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

