![Betty](https://raw.github.com/SamyPesse/master/betty.png)

Betty is your own cutomizable receptionist, to forward call and messages to your team anywhere in the world. It's particulary usefull if your company is operating in the US but based in another countries.

Betty is build using Twilio and Node.js and can be deployed to Heroku or any server easily.

#### Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

#### Configuration

Configuration is done using environment variables:

| Name         | Description         |
| ------------ | ------------------- |
| `PORT`       | Port for running the application (Default is `3000`) |
| `HOST`       | Hostname where the application is accessible |
| `TEAM`       | Comma separated list of team members in the format `name:phone`, example `TEAM=Samy:+15674895678,Aaron:+15674995678` |
| `TWILIO_SID` | API Application SID for Twilio |
| `TWILIO_TOKEN` | API Application Token for Twilio |
