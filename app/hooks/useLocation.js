import{useEffect, useState} from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
    const [ location, setLocation ] = useState();

    const getLocation = async () => {
        try {
            const {granted} = await Location.requestPermissionsAsync();
            if(granted){
                const coords = await Location.getCurrentPositionAsync();
                return coords;
            }else{
                return null;
            }
        } catch (error) {
            console.log("Error Location",error);
        }
    }

    useEffect(() => {
        getLocation().then((res) => {
            //console.log("response", res.coords);
            setLocation({latitude: res.coords.latitude, longitude: res.coords.longitude})
        }).catch((err) => {
            console.log("getLocation catch", err);
        });
    }, [location]);

    return location;
}

