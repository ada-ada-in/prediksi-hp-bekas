import React from "react";
import { Image } from "react-native";
import { authStyles } from "../style/Style";

export default function Logo() {
    return(
        <Image 
            source={require('../assets/images/images-removebg-preview.png')}
            style={authStyles.logo}
        />
    )
}