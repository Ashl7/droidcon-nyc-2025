
//
// StyleDictionaryColor.swift
//

// Do not edit directly, this file was auto-generated.


import UIKit

public enum StyleDictionaryColor {
    public static let colorsBlack = UIColor(red: 0.000, green: 0.000, blue: 0.000, alpha: 1)
    public static let colorsOrange100 = UIColor(red: 1.000, green: 0.980, blue: 0.941, alpha: 1)
    public static let colorsOrange200 = UIColor(red: 0.996, green: 0.922, blue: 0.784, alpha: 1)
    public static let colorsOrange300 = UIColor(red: 0.984, green: 0.827, blue: 0.553, alpha: 1)
    public static let colorsOrange400 = UIColor(red: 0.965, green: 0.678, blue: 0.333, alpha: 1)
    public static let colorsOrange500 = UIColor(red: 0.929, green: 0.537, blue: 0.212, alpha: 1)
    public static let colorsOrange600 = UIColor(red: 0.867, green: 0.420, blue: 0.125, alpha: 1)
    public static let colorsOrange700 = UIColor(red: 0.753, green: 0.337, blue: 0.129, alpha: 1)
    public static let colorsOrange800 = UIColor(red: 0.612, green: 0.259, blue: 0.129, alpha: 1)
    public static let colorsOrange900 = UIColor(red: 0.482, green: 0.204, blue: 0.118, alpha: 1)
    public static let colorsWhite = UIColor(red: 1.000, green: 1.000, blue: 1.000, alpha: 1)
}

// SwiftUI Color Extensions
public extension Color {
    // Base colors
    static var colorBlack: Color { Color(nsColor: StyleDictionaryColor.colorsBlack) }
    static var colorWhite: Color { Color(nsColor: StyleDictionaryColor.colorsWhite) }
    
    // Orange shades
    static var orange100: Color { Color(nsColor: StyleDictionaryColor.colorsOrange100) }
    static var orange200: Color { Color(nsColor: StyleDictionaryColor.colorsOrange200) }
    static var orange300: Color { Color(nsColor: StyleDictionaryColor.colorsOrange300) }
    static var orange400: Color { Color(nsColor: StyleDictionaryColor.colorsOrange400) }
    static var orange500: Color { Color(nsColor: StyleDictionaryColor.colorsOrange500) }
    static var orange600: Color { Color(nsColor: StyleDictionaryColor.colorsOrange600) }
    static var orange700: Color { Color(nsColor: StyleDictionaryColor.colorsOrange700) }
    static var orange800: Color { Color(nsColor: StyleDictionaryColor.colorsOrange800) }
    static var orange900: Color { Color(nsColor: StyleDictionaryColor.colorsOrange900) }
}
