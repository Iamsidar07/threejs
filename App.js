import { Canvas ,useFrame,useLoader} from '@react-three/fiber';
import { Suspense, useLayoutEffect, useRef, useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'expo-three';
import { useAnimatedSensor,SensorType } from 'react-native-reanimated';

const Box=(props)=>{
  const [active,setActive]=useState(false);

  useFrame((state,delta)=>{
    if(active){
      mesh.current.rotation.x-=delta;
      mesh.current.rotation.y+=delta;
    }
  })

  const mesh=useRef();  
  return (
  <mesh {...props} 
  ref={mesh}
  scale={active?1.2:1} 
  onClick={(e)=>setActive(!active)}>
    <boxGeometry />
    <meshStandardMaterial color={active?"red":"gray"} />
  </mesh>)
}

const Shoe=(props)=>{
  const mesh=useRef();
  const [base,normal,rough]=useLoader(TextureLoader,[
    require('./assets/Airmax/textures/BaseColor.jpg'),
    require('./assets/Airmax/textures/Normal.jpg'),
    require('./assets/Airmax/textures/Roughness.png'),
  ])
  const material=useLoader(MTLLoader,require("./assets/Airmax/shoe.mtl")
  )
  const obj=useLoader(
    OBJLoader,
    require('./assets/Airmax/shoe.obj'),
    (loader)=>{
      material.preload();
      loader.setMaterials(material);
    }
    )
  useLayoutEffect(() => {
    obj.traverse((child)=>{
      if(child instanceof THREE.Mesh){
        child.material.map=base;
        child.material.normalMap=normal;
        child.material.roughnessMap=rough;
      }
    })
    
  }, [obj])

  useFrame((state,delta)=>{
    let {x,y,z}=props.animatedSensor.sensor.value;
    x = ~~(x * 100) / 5000;
    y = ~~(y * 100) / 5000;
    z = ~~(z * 100) / 50000;
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
    mesh.current.rotation.z += z;

  })

  return (
    <mesh 
    rotation={[0.8,0,0]}
    ref={mesh}
    
    >
      <primitive object={obj} scale={15}/>
    </mesh>
  )
}

export default function App() {
  const animatedSensor=useAnimatedSensor(SensorType.GYROSCOPE,{
    interval:100,
  })
  
  return (
    <Canvas >
      {/* Canvas is like sheet  */}
      {/* In Order to render object we need to know the shape of object in threejs object is called Geometry*/}
      {/* This is like making movie 😀 Light, Camera, Action  */}
      {/* Object is 2d without lighting and do not shows the applied color shows black */}
      <ambientLight />
      <pointLight position={[10, 20,0]} />
      {/* mess is an object it need two thing what is the shape of it and material of it  */}   
      <Suspense fallback={null}>
      <Shoe animatedSensor={animatedSensor}/>
      </Suspense>
      {/* <Box position={[0,2,0]}/>
      <Box position={[0,0,0]}/>
      <Box position={[0,-2,0]}/> */}
      
      {/* <mesh>
        <sphereGeometry />
        <meshStandardMaterial color={"green"}/>
      </mesh> */}
      
    </Canvas>
  );
}


