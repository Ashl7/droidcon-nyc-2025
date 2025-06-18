import SwiftUI

struct SignUpView: View {
    @Environment(\.colorScheme) var colorScheme
    @AppStorage("isDarkMode") private var isDarkMode = false
    @State private var username = ""
    @State private var password = ""
    
    var body: some View {
        NavigationView {
            ZStack(alignment: .topTrailing) {
                VStack {
                    // Sign Up Header
                    Text("Sign Up")
                        .font(.largeTitle)
                        .bold()
                        .foregroundColor(.colorBlack)
                        .padding(.top, 100)
                        .padding(.bottom, 50)
                    
                    // Username field
                    TextField("Username", text: $username)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal, 40)
                        .padding(.bottom, 20)
                    
                    // Password field
                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal, 40)
                        .padding(.bottom, 30)
                    
                    // Sign Up Button
                    Button(action: {
                        // Add your sign up logic here
                        print("Sign up tapped - Username: \(username)")
                    }) {
                        Text("Sign Up")
                            .fontWeight(.semibold)
                            .foregroundColor(.colorWhite)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(Color.orange500)
                            )
                    }
                    .buttonStyle(PlainButtonStyle()) // This removes the default button styling
                    .padding(.horizontal, 40)
                    
                    Spacer()
                    
                    // Footer text
                    Text("Droidcon NYC 2025")
                        .font(.caption)
                        .foregroundColor(.orange700)
                        .padding(.bottom, 20)
                }
                
                // Dark/Light mode toggle in top right
                HStack {
                    Image(systemName: isDarkMode ? "moon.fill" : "sun.max.fill")
                        .foregroundColor(isDarkMode ? .colorWhite : .orange400)
                    
                    Toggle("", isOn: $isDarkMode)
                        .labelsHidden()
                }
                .padding()
                .background(isDarkMode ? Color.colorBlack.opacity(0.2) : Color.orange100)
                .cornerRadius(10)
                .padding()
            }
            .preferredColorScheme(isDarkMode ? .dark : .light)
        }
    }
}
