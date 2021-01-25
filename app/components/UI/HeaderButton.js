import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import Icon from "@expo/vector-icons/Ionicons";
import colors from "../../config/colors";

const CustomHeaderButton = (props) => {
    return(
        <HeaderButton
            {...props}
            iconSize={25}
            IconComponent={Icon}
            color={colors.primary}
        />
    );
};

export default CustomHeaderButton;
