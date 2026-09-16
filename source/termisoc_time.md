---
title: "TermiSoc Time"
source: dokuwiki
source_path: "sites:termiwiki:termisoc_time"
created: 2023-01-01
tags:
  - "termisoc"
  - "projects"
  - "relation"
  - "references"
  - "ben_a_lee"
  - "rich_jeffery"
---
TermiSoc Time is similar to Internet Time, with two differences:
- Days are divided into 1024 equal parts (called 'bytes'), not 1000 'beats'.
- 000 is equal to midnight UTC, not midnight in Biel (near Zurich).

A day is defined as 86400 SI seconds; therefore, one unit ('byte') in TermiSoc Time is equal to 84.375 seconds.

TermiSoc Time was devised by [Ben](TermiPeople/ben_a_lee.md) and [Rich](TermiPeople/rich_jeffery.md) at 3 am one night when they were discussing computer representations of time. They concluded that Swatch's internet time runs through an unknown time zone; and also that internet time should be measured in 1024 pieces, not 1000 (due to computing making 1024 bytes in a Megabyte, etc.).

The correct prefix to the time is Tt (it was originally destined to be ?, "U+0167 LATIN SMALL LETTER T WITH STROKE", but computers without Unicode support will not read it correctly). The time should either be displayed as an integer or to three decimal places.

## Constraints of TermiSoc Time
The current issue with TermiSoc Time is the 4th digit (ie: the 1) is only used for 24 bytes of the day, thus being redundant for the greater majority. There are future plans to reimplement it into a more appropriate base (8 or 16, most likely). This is to be discussed further and will probably be implemented in 2006.

## Implementations
### In PHP:
  <?PHP
      function termitime(){
          /* Find the number of seconds since midnight GMT */
          $seconds = (gmdate("G") * 3600) + (gmdate("i") * 60) + gmdate("s");
          /* Then divide it by 84.375, the number of seconds in a byte. */
          $bytes = $seconds/84.375;
          return $bytes;
      }
  ?>

### In Perl:
  sub termitime(){
    my @time = gmtime();
    my $seconds = ($time[2] * 3600) + ($time[1] * 60) + $time[0];
    my $bytes = $seconds/84.375;
    return $seconds;
  }

### In C/C++:
  #include <time.h> /* Or <ctime> in C++ */
    
  float termitime(void){
    struct tm timestruct;
    time_t timestamp;
    timestamp = time(0);
    gmtime_r(&timestamp,&timestruct);
        
    int seconds = tmstruct.tm_sec;
    seconds += (tmstruct.tm_min * 60);
    seconds += (tmstruct.tm_hour * 3600);
    float bytes = seconds/84.375; 
    return(bytes);
  }
