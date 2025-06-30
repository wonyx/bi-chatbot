# Japan Birth Demographics Dataset
This document describes the `japan_birth` table.

## **About Dataset**

Collective data of Japan's birth-related statistics from 1899 to 2022\. **Some data are missing between the years 1944 and 1946 due to records lost during World War II.**

For use case and analysis reference, please take a look at this notebook [Japan Birth Demographics Analysis](https://www.kaggle.com/code/webdevbadger/japan-birth-demographics-analysis)

## **Feature Descriptions**

* **year**: The year.  
* **birth\_total**: The total number of births.  
* **birth\_male**: The total number of male births.  
* **birth\_female**: The total number of female births.  
* **birth\_rate**: The birth rate. Equation is `birth_total / population_total * 1,000`  
* **birth\_gender\_ratio**: The birth gender ratio. Equation is `birth_male / birth_female * 1,000`  
* **total\_fertility\_rate**: The average number of children that are born to a woman over her lifetime.  
* **population\_total**: The total population.  
* **population\_male**: The total male population.  
* **population\_female**: The total female population.  
* **infant\_death\_total**: The total infant deaths.  
* **infant\_death\_male**: The total male infant deaths.  
* **infant\_death\_female**: The total female infant deaths.  
* **infant\_death\_unknown\_gender**: The total unknown gender infant deaths.  
* **infant\_death\_rate**: The infant death rate. Equation is `infant_death_total / birth_total * 1,000`  
* **infant\_death\_gender\_ratio**: The infant death gender ratio. Equation is `infant_death_male / infant_death_female * 1,000`  
* **infant\_deaths\_in\_total\_deaths**: The infant death ratio among other deaths.  
* **stillbirth\_total**: The total number of stillbirths (dead born).  
* **stillbirth\_male**: The total number of male stillbirths.  
* **stillbirth\_female**: The total number of female stillbirths.  
* **stillbirth\_unknown\_gender**: The total number of unknown gender stillbirths.  
* **stillbirth\_rate**: The stillbirth rate. Equation is `stillbirth_total / (birth_total + stillbirth_total) * 1,000`  
* **stillbirth\_gender\_ratio**: The stillbirth gender ratio. Equation is `stillbirth_male / stillbirth_female * 1,000`  
* **firstborn**: The number of firstborns.  
* **secondborn**: The number of secondborns.  
* **thirdborn**: The number of thirdborns.  
* **forthborn**: The number of forthborns.  
* **fifthborn\_and\_above**: The number of fifthborns and above.  
* **weeks\_under\_28**: The number of births occurred under week 28\. Early terms.  
* **weeks\_28-31**: The number of births occurred between weeks 28 and 31\. Early terms.  
* **weeks\_32-36**: The number of births occurred between weeks 32 and 36\. Early terms.  
* **weeks\_37-41**: The number of births occurred between weeks 37 and 41\. Full terms.  
* **weeks\_over\_42**: The number of births occurred over week 42\. Late terms.  
* **mother\_age\_avg**: The mother's average age.  
* **mother\_age\_firstborn**: The mother's average age of the firstborn.  
* **mother\_age\_secondborn**: The mother's average age of the secondborn.  
* **mother\_age\_thirdborn**: The mother's average age of the thirdborn.  
* **mother\_age\_under\_19**: The number of births by mothers under age 19\.  
* **mother\_age\_20-24**: The number of births by mothers between age 20 and 24\.  
* **mother\_age\_25-29**: The number of births by mothers between age 25 and 29\.  
* **mother\_age\_30-34**: The number of births by mothers between age 30 and 34\.  
* **mother\_age\_35-39**: The number of births by mothers between age 35 and 39\.  
* **mother\_age\_40-44**: The number of births by mothers between age 40 and 44\.  
* **mother\_age\_over\_45**: The number of births by mothers over 45\.  
* **father\_age\_avg**: The father's average age.  
* **father\_age\_firstborn**: The father's average age of the firstborn.  
* **father\_age\_secondborn**: The father's average age of the secondborn.  
* **father\_age\_thirdborn**: The father's average age of the thirdborn.  
* **legitimate\_child**: The Number of births under married parents.  
* **illegitimate\_child**: The number of births under non-married parents.

