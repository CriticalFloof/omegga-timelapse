<!--

When uploading your plugin to github/gitlab
start your repo name with "omegga-"

example: https://github.com/CriticalFloof/omegga-timelapse

Your plugin will be installed via omegga install gh:CriticalFloof/timelapse

-->

# timelapse

Allows you to record timelapses of your builds and play them back!

## Install

`omegga install gh:CriticalFloof/timelapse`

## Commands

/timelapse_record "name", to start a timelapse.
/timelapse_play "name" will allow you to replay recorded timelapses.
/timelapse_stop to stop recording or playing a timelapse.
/timelapse_delete "name" removes a timelapse.
/timelapse_list shows all timelapses saved.

## Config

Trusted Role: Chooses who can run these commands.
Timelapse Playback Speed: The speed the timelapse is ran.
Timelapse Record Speed: The speed the timelapse is recorded.
Frame Notification: Whenever recording a timelapse, broadcast which frame was saved.
