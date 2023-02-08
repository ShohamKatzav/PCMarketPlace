# PCMarketPlace

We digital is an online store for computers and computer peripheral devices.
In this store evert user can upload a deal for sell.
A deal must include at least one product details (name,category,price) and can also include one image.

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

The user can view the deals he upload.
Another options are editing (description, products, photo) or deleting the deal.
The request of editing a deal will have to pass validation (At least one product and a short description)

### Available Deals

Will show every deal available upload by every user.
Deal can only be displayed in this page.

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

## appsettings.Development.json example

<code>
{
  "CloudinarySettings":{
    "CloudName": "",
    "ApiKey": "",
    "ApiSecret": ""
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data source=pcmarketplace.db"
  },
  "TokenKey": "",
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Information",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
</code>

Pass CloudinarySettings in order to use upload photo services.
ConnectionStrings will provide our database details.
TokenKey used for token service and should be a hard to guess string password (16-32 characters)


Login details for "Admin":
User Name: Shoham
Password: Pa$$w0rd

Login details for "User":
User Name: Caitlin
Password: Pa$$w0rd
