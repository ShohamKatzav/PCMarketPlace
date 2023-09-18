# PCMarketPlace

PCMarketPlace is an online store for computers and peripheral devices.
In this store evert user can upload a deal for sell.
Every deal include a description (8 chars) and at least one product details (Name, Category, Price and can also include one image).
Total deal price must be above 5 ILS due to strip billing restrictions.

## Getting Started 

### Prerequisites  
- Node.js (https://nodejs.org) 
- Angular CLI (https://angular.io/cli) 
- .NET SDK (https://dotnet.microsoft.com/download) 

### Clone the Repository  

```bash 
git clone https://github.com/ShohamKatzav/PCMarketPlace.git cd PCMarketPlace
```

### appsettings.Development.json

#### Set Up Cloudinary

1.  Sign up for a Cloudinary account ([https://cloudinary.com](https://cloudinary.com/)).
2.  Get your Cloudinary API credentials: CloudName, ApiKey, and ApiSecret.
3.  Open `appsettings.Development.json` and add your Cloudinary API credentials:
<pre><code>{  
    "CloudinarySettings":  { 
        "CloudName":  "your-cloud-name",
        "ApiKey":  "your-api-key", 
        "ApiSecret":  "your-api-secret"  
    }, 
}</code></pre>


#### Set Up JWT

1.  Generate a unique JWT token (you can use online tools or libraries).
2.  Open `appsettings.Development.json` and add your JWT token.

#### Set Up Stripe

1.  Sign up for a Stripe account ([https://stripe.com](https://stripe.com/)).
2.  Get your Stripe API keys: Secret Key and Publishable Key.
3.  Open `appsettings.Development.json` and add your Stripe API keys.

An example for `appsettings.Development.json` file (Should be place in ```api``` directory):

<pre><code>{
    "CloudinarySettings":  {
        "CloudName":  "your-cloud-name",
        "ApiKey":  "your-api-key", 
        "ApiSecret":  "your-api-secret" 
    },
    "ConnectionStrings":  {
        "DefaultConnection": "Data source=pcmarketplace.db"
    },
    "TokenKey": "secret unguessable key [16-32 chars unguessable text]",
    "Logging":  {
        "LogLevel": {
            "Default": "Information",
            "Microsoft": "Information",
            "Microsoft.Hosting.Lifetime": "Information"
        }
    },
   "StripeSettings":  {
        "SecretKey": "sk_test_....",
        "PublishableKey": "pk_test_...."
    }
}</code></pre>

### Install Dependencies
#### Install Angular dependencies and run
```bash 
cd client
npm install
ng serve
```

#### Install .NET dependencies and run (From projects root directory - New terminal)
```bash 
dotnet run
```

### Login Details

Login details for "Admin":
User Name: Shoham
Password: Pa$$w0rd

Login details for "User":
User Name: Caitlin
Password: Pa$$w0rd

## Data

The data in my program stored with sqlite.
Categories stored in the file CategorySeedData.json.
Every other data kinds (users,products,deals) stored in the file UserSeedData.json.
Once the programe execute the class Seed.cs will deserialize the data and build the database.

## Login

In order to get service every user has to pass a simple identity proceess.
The user need to type username and password in the correct fields.
The user will get alerts for invalid input or fields which left empty.
After a successful attempt of login/register the user will receive back a token.
The token will allow the user to be served without the need in identifying again till his logout.
 
## Navigate Bar

Every user has his own responsive bar.
User who authorized as admin will be able to see more options than customer in his bar.

## Navigate options for user:

### Home

Return to home page.
In this page the user can also register to the site.

### My Deals

The user can view the deals he uploaded.
Other options are editing (description, products) or deleting the deal.
The request for editing a deal will have to pass validation (At least one product and a short description)

### Available Deals

Will display all deals uploaded by other users (excluding the current user).
From this page the user can view the deal or start the transaction process.

### List a new deal

In this page the user will upload his new deals.
As mentioned before, every deal has to include a short description (8 characters at least) and 1 product detail.
Maximum products per deal set to 10.

### About us

Introduce the shop to our new users.

## Navigate options for admin:

### Members

Allow the admin to view and edit every user detail.

### Categories

Allow the admin to add/edit/remove deal categories.

## Guards

### Auth guard

Visitors who didnt pass the authentication process wont be able to use the store services.

### Admin guard

Regular users won't be able to reach admin's paths

### Prevent unsaved changes guard

This guard will notify the user before leaving unsaved changes.

## Interceptor

### Error Interceptor

Will inform the user about validation failure.
Also handle server side exceptions (500) or any other unexpected behaviors (page not found etc.).

### JWT Interceptor

This Interceptor will send the token with every http request.

### Loading Interceptor

Will show and hide ngx-spinner while the user is waiting for page to load.


## Footer

Responsive footwer which include a short introduction to our new customers and ways to contact the store's staff.


## Things to Improve:

1. Optimize Deal Storage: Currently, deals are cached, but there may be more efficient ways to manage and store deal data, especially as the application scales. Exploring alternative storage strategies or data structures could lead to better performance.

2. Limit Cached Pages: Consider implementing a mechanism to limit the number of cached pages. This can help control memory usage and ensure that only the most relevant data is cached, which may be particularly important as the application grows.

3. Real-Time Updates with WebSockets: Implement real-time updates using WebSocket technology to keep users informed of changes made by other users.

