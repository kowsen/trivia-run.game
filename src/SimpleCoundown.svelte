<script lang="ts">
    import { onDestroy } from "svelte";
    import { upgrade } from "./client";
    import {differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
  
    export let endTime: number;
    let timerStr: string;
  
    function getTimeLeft() {
      return endTime ? endTime - Date.now() : 0;
    }
  
    function updateTimerStr() {
        var left = new Date(endTime);
        var right = new Date();
        const daysLeft = differenceInDays(endTime, right);
        const hoursLeft = differenceInHours (endTime, right);
        const minutesLeft = differenceInMinutes (endTime, right);
        const secondsLeft = differenceInSeconds (endTime, right);
        let message= "";
        if (daysLeft > 0){
            message += daysLeft + " days, ";
        }
        if (hoursLeft > 0){
            message += (hoursLeft % 24) + " hours, ";
        }
        if (minutesLeft > 0){
            message += (minutesLeft % 60) + " minutes, ";
        }
        if (secondsLeft > 0){
            message += (secondsLeft % 60) + " seconds";
        }
        
      timerStr = message;
    }
  
    let refreshTimeout: ReturnType<typeof setTimeout>;
  
    function countdown() {
      updateTimerStr();
      if (endTime > Date.now()) {
        refreshTimeout = setTimeout(() => {
          countdown();
        }, 1000);
      } else {
        void upgrade();
      }
    }
  
    $: {
      if (endTime > Date.now()) {
        clearTimeout(refreshTimeout);
        countdown();
      } else {
      }
    }
  
    onDestroy(() => {
      clearTimeout(refreshTimeout);
    });
  </script>
  {timerStr}