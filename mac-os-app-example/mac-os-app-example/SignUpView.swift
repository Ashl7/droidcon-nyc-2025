import SwiftUI

// Custom TextFieldStyle for consistent styling
struct CustomTextFieldStyle: TextFieldStyle {
    @FocusState private var isFocused: Bool
    
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(10)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color(isFocused ? DroidconColors.colorSecondaryLight : .gray), lineWidth: 1)
            )
            .focused($isFocused)
    }
}

struct SignUpView: View {
    @Environment(\.colorScheme) var colorScheme
    @AppStorage("isDarkMode") private var isDarkMode = false
    @State private var username = ""
    @State private var password = ""
    @FocusState private var focusedField: Field?
    
    enum Field {
        case username
        case password
    }
    
    var body: some View {
        NavigationView {
            ZStack(alignment: .topTrailing) {
                VStack {
                    // Sign Up Header
                    Text("Log in to your Droidcon account")
                        .font(.largeTitle)
                        .bold()
                        .foregroundColor(Color(isDarkMode ? DroidconColors.colorPrimaryDark : DroidconColors.colorPrimaryLight))
                        .padding(.top, 100)
                        .padding(.bottom, 50)
                    
                    // Username field
                    TextField("Username", text: $username)
                        .textFieldStyle(.plain)
                        .padding(10)
                        .background(
                            RoundedRectangle(cornerRadius: DroidconDimensions.dimensionRadius2)
                                .stroke(Color(focusedField == .username ?
                                           (isDarkMode ? DroidconColors.colorPrimaryDark : DroidconColors.colorPrimaryLight) :
                                           .gray),
                                      lineWidth: 1)
                        )
                        .focused($focusedField, equals: .username)
                        .padding(.horizontal, 40)
                        .padding(.bottom, 20)
                    
                    // Password field
                    SecureField("Password", text: $password)
                        .textFieldStyle(.plain)
                        .padding(10)
                        .background(
                            RoundedRectangle(cornerRadius: DroidconDimensions.dimensionRadius2)
                                .stroke(Color(focusedField == .password ?
                                           (isDarkMode ? DroidconColors.colorPrimaryDark : DroidconColors.colorPrimaryLight) :
                                           .gray),
                                      lineWidth: 1)
                        )
                        .focused($focusedField, equals: .password)
                        .padding(.horizontal, 40)
                        .padding(.bottom, 30)
                    
                    // Sign Up Button
                    Button(action: {
                        // Add your sign up logic here
                        print("Log in tapped - Username: \(username)")
                    }) {
                        Text("Log in")
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(
                                RoundedRectangle(cornerRadius: DroidconDimensions.dimensionRadius2)
                                    .fill(Color(isDarkMode ? DroidconColors.colorPrimaryDark : DroidconColors.colorPrimaryLight))
                            )
                    }
                    .buttonStyle(PlainButtonStyle()) // This removes the default button styling
                    .padding(.horizontal, 40)
                    
                    Spacer()
                    
                    // Footer text
                    Text("Droidcon NYC 2025")
                        .font(.caption)
                        .foregroundColor(Color(isDarkMode ? DroidconColors.colorSecondaryDark : DroidconColors.colorSecondaryLight))
                        .padding(.bottom, 20)
                }
                
                // Dark/Light mode toggle in top right
                HStack {
                    Image(systemName: isDarkMode ? "moon.fill" : "sun.max.fill")
                        .foregroundColor(Color(isDarkMode ? DroidconColors.colorPrimaryDark : DroidconColors.colorPrimaryLight))
                    
                    Toggle("", isOn: $isDarkMode)
                        .labelsHidden()
                }
                .padding()
                .background(Color(isDarkMode ? DroidconColors.colorPrimaryDark : DroidconColors.colorPrimaryLight).opacity(0.2))
                .cornerRadius(DroidconDimensions.dimensionRadius2)
                .padding()
            }
            .preferredColorScheme(isDarkMode ? .dark : .light)
        }
    }
}
